import { sha256 } from './sha256'

// Zero-width encoder: maps 2 bits to a char
const ZW_CHARS = ['\u200B', '\u200C', '\u200D', '\u2060']
const ZW_PREFIX = '\uFEFF' // BOM as marker

function toZeroWidth(hex) {
  let bits = ''
  for (let i = 0; i < hex.length; ++i) {
    bits += parseInt(hex[i], 16).toString(2).padStart(4, '0')
  }
  let out = ZW_PREFIX
  for (let i = 0; i < bits.length; i += 2) {
    const chunk = bits.slice(i, i + 2)
    out += ZW_CHARS[parseInt(chunk, 2)]
  }
  return out
}

export async function signText(payload) {
  // Deterministic: sort keys
  const ordered = { affirmation: true, ip: payload.ip, text: payload.text, ts: payload.ts }
  const json = JSON.stringify(ordered)
  const hash = await sha256(json)
  const zw = toZeroWidth(hash)
  // Insert after first visible char
  const idx = payload.text.search(/\S/)
  if (idx === -1) return payload.text // no visible char
  return (
    payload.text.slice(0, idx + 1) + zw + payload.text.slice(idx + 1)
  )
}
