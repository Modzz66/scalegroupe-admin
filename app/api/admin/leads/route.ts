import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

function toLead(l: any) {
  return {
    id: l.id,
    name: l.name,
    email: l.email,
    telefon: l.telefon || '',
    unternehmen: l.unternehmen || '',
    interesse: l.interesse || '',
    nachricht: l.nachricht,
    datum: new Date(l.createdAt).toISOString().split('T')[0],
    status: l.status,
    gelesen: l.gelesen,
  }
}

export async function GET() {
  const { err } = await requireAdmin()
  if (err) return err
  const rows = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(rows.map(toLead))
}

export async function POST(req: Request) {
  const { err } = await requireAdmin()
  if (err) return err
  try {
    const b = await req.json()
    const l = await prisma.lead.create({
      data: {
        name: b.name, email: b.email, telefon: b.telefon,
        unternehmen: b.unternehmen, interesse: b.interesse,
        nachricht: b.nachricht, status: b.status || 'Neu',
        quelle: b.quelle || 'Kontaktformular',
      },
    })
    return NextResponse.json(toLead(l))
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
