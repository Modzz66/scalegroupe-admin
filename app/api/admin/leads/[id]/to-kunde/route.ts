import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { err } = await requireAdmin()
  if (err) return err
  const { id } = await params
  try {
    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })

    const b = await req.json()
    const kunde = await prisma.kunde.create({
      data: {
        name: lead.name,
        email: lead.email,
        telefon: lead.telefon,
        unternehmen: lead.unternehmen,
        paket: b.paket || lead.interesse,
        status: 'Aktiv',
        notizen: lead.nachricht,
      },
    })

    await prisma.lead.update({
      where: { id },
      data: { status: 'Qualifiziert' },
    })

    return NextResponse.json(kunde)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
