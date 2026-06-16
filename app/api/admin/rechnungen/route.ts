import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

function toRechnung(r: any) {
  return {
    id: r.id,
    nummer: r.nummer,
    kundeId: r.kundeId,
    kundeName: r.kunde?.name || '',
    paket: r.kunde?.paket || '',
    betrag: r.betrag,
    status: r.status,
    datum: new Date(r.datum).toISOString().split('T')[0],
    faellig: r.faellig ? new Date(r.faellig).toISOString().split('T')[0] : '',
    beschreibung: r.beschreibung || '',
  }
}

export async function GET() {
  const { err } = await requireAdmin()
  if (err) return err
  const rows = await prisma.rechnung.findMany({ include: { kunde: true }, orderBy: { datum: 'desc' } })
  return NextResponse.json(rows.map(toRechnung))
}

export async function POST(req: Request) {
  const { err } = await requireAdmin()
  if (err) return err
  try {
    const b = await req.json()
    const r = await prisma.rechnung.create({
      data: {
        nummer: b.nummer, betrag: parseFloat(b.betrag), status: b.status || 'Entwurf',
        beschreibung: b.beschreibung, datum: b.datum ? new Date(b.datum) : new Date(),
        faellig: b.faellig ? new Date(b.faellig) : null, kundeId: b.kundeId,
      },
      include: { kunde: true },
    })
    return NextResponse.json(toRechnung(r))
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
