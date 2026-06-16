export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const { err } = await requireAdmin()
  if (err) return err
  const rows = await prisma.datei.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(rows.map(d => ({
    id: d.id,
    name: d.name,
    typ: d.typ,
    groesse: `${Math.round(d.groesse / 1024)} KB`,
    datum: new Date(d.createdAt).toISOString().split('T')[0],
    kundeId: d.kundeId || '',
    ordner: d.ordner,
    url: d.url,
  })))
}

export async function POST(req: Request) {
  const { err } = await requireAdmin()
  if (err) return err
  try {
    const b = await req.json()
    const d = await prisma.datei.create({
      data: {
        name: b.name, url: b.url || '#', typ: b.typ,
        groesse: parseInt(b.groesse) || 0, ordner: b.ordner || 'Allgemein',
        kundeId: b.kundeId || null,
      },
    })
    return NextResponse.json(d)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
