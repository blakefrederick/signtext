import TextSigner from '../components/TextSigner'
import { headers } from 'next/headers'

export default function Page() {
  let ip = null
  try {
    const headersList = headers()
    ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || null
  } catch {}
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-xl mx-4">
        <h1 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">SignText</h1>
        <TextSigner ip={ip} />
      </div>
    </main>
  )
}
