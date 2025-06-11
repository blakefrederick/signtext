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
        className="w-full bg-transparent outline-none text-white border border-white/20 rounded-xl p-4 min-h-[120px] max-h-64 text-lg shadow-inner resize-none cursor-default select-all"
        value={value}
        readOnly
        tabIndex={-1}
        aria-label="Signed output"
      />
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-3 right-3 bg-white/20 text-white px-3 py-1 rounded-lg shadow hover:bg-white/30 active:scale-95 transition text-sm border border-white/30"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <div className="text-green-400 text-center mt-3 text-base font-medium drop-shadow">Your message has been signed and invisibly watermarked.</div>
    </div>
  )
}
