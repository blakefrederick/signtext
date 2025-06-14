import { sha256 } from './sha256'
import CryptoJS from 'crypto-js'

// Zero-width encoder: maps 2 bits to a char
const ZW_CHARS = ['\u200B', '\u200C', '\u200D', '\u2060']
const ZW_PREFIX = '\uFEFF' // BOM as marker
const SECRET_KEY = 'signtext-v1-secret-key' // In production, use env var

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

export function encodePayload(payload) {
  const json = JSON.stringify(payload)
  const ciphertext = CryptoJS.AES.encrypt(json, SECRET_KEY).toString()
  // Convert to base64, then to zero-width
  let zw = '\uFEFF'
  for (let c of btoa(ciphertext)) {
    // Map 2 bits to a zero-width char
    const bits = c.charCodeAt(0).toString(2).padStart(8, '0')
    for (let i = 0; i < 8; i += 2) {
      const chunk = bits.slice(i, i + 2)
      zw += ['\u200B', '\u200C', '\u200D', '\u2060'][parseInt(chunk, 2)]
    }
  }
  return zw
}

export function decodePayloadZW(text) {
  // Find BOM marker and zero-width chars after first visible char
  const zwMatch = text.match(/\S(\uFEFF[\u200B\u200C\u200D\u2060]+)/)
  if (!zwMatch) return null
  const zw = zwMatch[1].slice(1)
  let bits = ''
  for (let c of zw) {
    if (c === '\u200B') bits += '00'
    else if (c === '\u200C') bits += '01'
    else if (c === '\u200D') bits += '10'
    else if (c === '\u2060') bits += '11'
  }
  // Convert bits to base64 string
  let b64 = ''
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.slice(i, i + 8)
    if (byte.length === 8) b64 += String.fromCharCode(parseInt(byte, 2))
  }
  try {
    const ciphertext = atob(b64)
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY)
    const json = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(json)
  } catch {
    return null
  }
}
