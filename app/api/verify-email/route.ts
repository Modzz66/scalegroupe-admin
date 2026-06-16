export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Token fehlt' }, { status: 400 })

  const record = await prisma.verificationToken.findUnique({ where: { token } })
  if (!record || record.expires < new Date())
    return NextResponse.json({ error: 'Token ungÃ¼ltig oder abgelaufen' }, { status: 400 })

  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerified: new Date() },
  })
  await prisma.verificationToken.delete({ where: { token } })

  return NextResponse.json({ success: true })
}
