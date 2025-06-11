import TextSigner from '../components/TextSigner'
import { headers } from 'next/headers'

export default async function Page() {
  let ip = null
  try {
    const headersList = await headers()
    ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || null
  } catch {}
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="liquid-glass p-8 w-full max-w-xl mx-4">
        <h1 className="text-4xl font-extrabold text-center mb-6 tracking-tight text-[#232b5d] drop-shadow-lg" style={{fontFamily: 'SF Pro Display, San Francisco, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif', letterSpacing: '-0.01em'}}>SignText</h1>
        <TextSigner ip={ip} />
      </div>
    </main>
  )
}
