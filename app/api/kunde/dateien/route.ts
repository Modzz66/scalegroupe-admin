import { prisma } from '@/lib/prisma'
import { requireSession } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const { session, err } = await requireSession()
  if (err) return err
  const kunde = await prisma.kunde.findUnique({ where: { userId: session!.user.id } })
  if (!kunde) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const dateien = await prisma.datei.findMany({
    where: { kundeId: kunde.id },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(dateien.map(d => ({
    id: d.id, name: d.name, typ: d.typ,
    groesse: `${Math.round(d.groesse / 1024)} KB`,
    datum: new Date(d.createdAt).toISOString().split('T')[0],
    ordner: d.ordner, url: d.url,
  })))
}
