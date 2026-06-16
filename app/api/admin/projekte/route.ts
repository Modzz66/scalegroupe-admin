export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

function toProjekt(p: any) {
  return {
    id: p.id,
    name: p.name,
    kundeId: p.kundeId,
    kundeName: p.kunde?.name || '',
    paket: p.paket || '',
    status: p.status,
    deadline: p.deadline ? new Date(p.deadline).toISOString().split('T')[0] : '',
    budget: p.budget || 0,
    fortschritt: p.fortschritt,
    beschreibung: p.beschreibung || '',
    verantwortlich: p.verantwortlich || '',
    erstellt: new Date(p.createdAt).toISOString().split('T')[0],
  }
}

export async function GET() {
  const { err } = await requireAdmin()
  if (err) return err
  const rows = await prisma.projekt.findMany({ include: { kunde: true }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(rows.map(toProjekt))
}

export async function POST(req: Request) {
  const { err } = await requireAdmin()
  if (err) return err
  try {
    const b = await req.json()
    const p = await prisma.projekt.create({
      data: {
        name: b.name, beschreibung: b.beschreibung, paket: b.paket,
        status: b.status || 'Offen', fortschritt: b.fortschritt || 0,
        budget: b.budget ? parseFloat(b.budget) : null,
        deadline: b.deadline ? new Date(b.deadline) : null,
        verantwortlich: b.verantwortlich, kundeId: b.kundeId,
      },
      include: { kunde: true },
    })
    return NextResponse.json(toProjekt(p))
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
