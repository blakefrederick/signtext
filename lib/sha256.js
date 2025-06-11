// Minimal SHA256 for browser (no deps)
export async function sha256(str) {
  if (window && window.crypto && window.crypto.subtle) {
    const buf = new TextEncoder().encode(str)
    const hash = await window.crypto.subtle.digest('SHA-256', buf)
    return Array.from(new Uint8Array(hash)).map(x => x.toString(16).padStart(2, '0')).join('')
  }
  // Node fallback
  const { createHash } = await import('crypto')
  return createHash('sha256').update(str).digest('hex')
}
