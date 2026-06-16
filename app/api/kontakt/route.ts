import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (body.website) return NextResponse.json({ success: true }) // Honeypot

    const lead = await prisma.lead.create({
      data: {
        name: body.name, email: body.email, telefon: body.telefon,
        unternehmen: body.unternehmen, interesse: body.interesse,
        nachricht: body.nachricht, quelle: 'Kontaktformular', status: 'Neu', gelesen: false,
      },
    })

    await sendEmail({
      to: 'team@scalegroupe.de',
      subject: `🔔 Neue Anfrage: ${body.name}`,
      html: `<h2>Neue Kontaktanfrage</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>E-Mail:</strong> ${body.email}</p>
        <p><strong>Telefon:</strong> ${body.telefon || '–'}</p>
        <p><strong>Unternehmen:</strong> ${body.unternehmen || '–'}</p>
        <p><strong>Interesse:</strong> ${body.interesse || '–'}</p>
        <p><strong>Nachricht:</strong> ${body.nachricht}</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/leads" style="background:#7C3AED;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">Im Admin ansehen →</a>`,
    })

    await sendEmail({
      to: body.email,
      subject: 'Deine Anfrage bei ScaleGroupe',
      html: `<p>Hallo ${body.name},</p><p>vielen Dank für deine Anfrage! Wir melden uns innerhalb von 24 Stunden.</p><p>Dein ScaleGroupe Team</p>`,
    })

    return NextResponse.json({ success: true, id: lead.id })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
