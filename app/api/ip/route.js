// Next.js 15 API route for client IP fallback
export async function GET(req) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || req.ip || null
  return Response.json({ ip })
}
