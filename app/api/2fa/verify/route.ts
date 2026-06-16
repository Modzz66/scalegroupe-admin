import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { authenticator } from 'otplib'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code } = await req.json()
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.twoFactorSecret) return NextResponse.json({ error: 'Fehler' }, { status: 400 })

  if (authenticator.check(code, user.twoFactorSecret)) {
    return NextResponse.json({ success: true })
  }

  for (let i = 0; i < user.backupCodes.length; i++) {
    const match = await bcrypt.compare(code, user.backupCodes[i])
    if (match) {
      const newCodes = user.backupCodes.filter((_, idx) => idx !== i)
      await prisma.user.update({ where: { id: user.id }, data: { backupCodes: newCodes } })
      return NextResponse.json({ success: true })
    }
  }

  return NextResponse.json({ error: 'Ungültiger Code' }, { status: 400 })
}
