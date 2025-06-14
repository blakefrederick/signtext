import { useState } from 'react'
import { decodePayloadZW } from '../lib/sign'

export default function OutputDisplay({ value }) {
  const [copied, setCopied] = useState(false)
  const [decodedInput, setDecodedInput] = useState('')
  const [decodedPayload, setDecodedPayload] = useState(null)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  return (
    <div className="relative mt-6">
      <textarea
        className="liquid-input w-full min-h-[120px] max-h-64 text-lg shadow-inner resize-none cursor-default select-all p-4"
        value={value}
        readOnly
        tabIndex={-1}
        aria-label="Signed output"
        style={{fontFamily: 'inherit'}}
      />
      <button
        type="button"
        onClick={handleCopy}
        className="liquid-copy-btn absolute top-3 right-3 px-3 py-1 text-sm"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <div className="text-[#232b5d] text-center mt-3 text-base font-semibold" style={{textShadow: '0 1px 2px #e0e7ff, 0 0.5px 0 #a5b4fc'}}>^ Your message has been signed and invisibly watermarked.</div>
      <div className="mt-4 text-center text-sm text-[#232b5d] font-mono bg-white/60 rounded-lg px-4 py-2 mx-auto max-w-lg border border-[#a5b4fc]">
        <span className="block font-semibold mb-1">How to see the invisible characters:</span>
        <span className="block">Paste the signed text into <a href="https://invisiblecharacterviewer.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">invisiblecharacterviewer.com</a> to reveal the embedded zero-width Unicode signature.<br/>This invisible signature encodes a cryptographic hash of the text, your IP, timestamp, and your human authorship affirmation.</span>
      </div>
      {/* Decoder input */}
      <div className="mt-16 flex flex-col items-center gap-2">
        <label htmlFor="decode-input" className="text-[#232b5d] text-sm font-semibold">Decode a signed message:</label>
        <textarea
          id="decode-input"
          className="liquid-input w-full max-w-xl min-h-[60px] text-xs font-mono p-2"
          placeholder="Paste a signed message here to decode..."
          onChange={e => {
            const val = e.target.value
            setDecodedInput(val)
            // Use new reversible decoder
            let payload = null
            try {
              payload = decodePayloadZW(val)
            } catch {}
            setDecodedPayload(payload)
          }}
          value={decodedInput || ''}
        />
        {decodedPayload && (
          <pre className="bg-white/90 rounded-lg p-3 mt-2 text-xs font-mono text-[#232b5d] whitespace-pre-line border border-[#a5b4fc] w-full max-w-xl text-left overflow-x-auto">
            {JSON.stringify(decodedPayload, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
