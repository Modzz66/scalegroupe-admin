export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const secret = req.headers.get('x-setup-secret')
  if (secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { email, password, name } = await req.json()
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN', emailVerified: new Date() }
    })
    return NextResponse.json({ updated: true, email })
  }
  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.create({
    data: {
      name, email, password: hashed,
      role: 'ADMIN',
      emailVerified: new Date(),
    }
  })
  return NextResponse.json({ created: true, email })
}
