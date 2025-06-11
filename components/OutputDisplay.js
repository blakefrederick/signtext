import { useState } from 'react'

export default function OutputDisplay({ value }) {
  const [copied, setCopied] = useState(false)
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
      <div className="text-black text-center mt-3 text-base font-medium drop-shadow">Your message has been signed and invisibly watermarked.</div>
    </div>
  )
}
