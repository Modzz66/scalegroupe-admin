import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { name, email, password, unternehmen } = await req.json()

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return NextResponse.json({ error: 'E-Mail bereits registriert' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name, email, password: hashed, role: 'KUNDE',
        kunde: { create: { name, email, unternehmen, status: 'Ausstehend' } },
      },
    })

    const token = randomBytes(16).toString('hex')
    await prisma.verificationToken.create({
      data: {
        token, type: 'EMAIL_VERIFY', userId: user.id,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`
    await sendEmail({
      to: email,
      subject: 'E-Mail bestätigen – ScaleGroupe',
      html: `<p>Hallo ${name},</p><p>Bitte bestätige deine E-Mail-Adresse:</p>
        <a href="${verifyUrl}" style="background:#7C3AED;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0">E-Mail bestätigen</a>
        <p>Link gültig für 24 Stunden.</p>`,
    })

    await sendEmail({
      to: 'team@scalegroupe.de',
      subject: `🆕 Neuer Kunde registriert: ${name}`,
      html: `<p>Neuer Kunde: <strong>${name}</strong> (${email})</p><p>Unternehmen: ${unternehmen || '–'}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/kunden">Im Admin ansehen →</a>`,
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
