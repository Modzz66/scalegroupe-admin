import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const secret = authenticator.generateSecret()
  const otpauth = authenticator.keyuri(session.user.email!, 'ScaleGroupe', secret)
  const qrUrl = await QRCode.toDataURL(otpauth)

  await prisma.user.update({
    where: { id: session.user.id },
    data: { twoFactorSecret: secret },
  })

  return NextResponse.json({ secret, qrUrl })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code } = await req.json()
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.twoFactorSecret) return NextResponse.json({ error: 'Kein Secret' }, { status: 400 })

  const valid = authenticator.check(code, user.twoFactorSecret)
  if (!valid) return NextResponse.json({ error: 'Ungültiger Code' }, { status: 400 })

  const backupCodes = Array.from({ length: 8 }, () => randomBytes(5).toString('hex'))
  const hashedCodes = await Promise.all(backupCodes.map(c => bcrypt.hash(c, 10)))

  await prisma.user.update({
    where: { id: session.user.id },
    data: { twoFactorEnabled: true, backupCodes: hashedCodes },
  })

  return NextResponse.json({ success: true, backupCodes })
}
