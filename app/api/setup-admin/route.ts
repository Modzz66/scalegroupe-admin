export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('secret') !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const email = searchParams.get('email') || 'info@pure-werte.de'
  const password = searchParams.get('password') || 'Admin1234!'
  const name = searchParams.get('name') || 'Admin'

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
    data: { name, email, password: hashed, role: 'ADMIN', emailVerified: new Date() }
  })
  return NextResponse.json({ created: true, email })
}
