import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

function toKunde(k: any) {
  return {
    id: k.id,
    name: k.name,
    email: k.email,
    telefon: k.telefon || '',
    unternehmen: k.unternehmen || '',
    paket: k.paket || '',
    umsatz: k._sum?.betrag || 0,
    status: k.status === 'Aktiv' ? 'Aktiv' : k.status === 'Inaktiv' ? 'Inaktiv' : 'Aktiv',
    seit: new Date(k.createdAt).toISOString().slice(0, 7),
    avatar: k.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
    notizen: k.notizen || '',
  }
}

export async function GET() {
  const { err } = await requireAdmin()
  if (err) return err
  const kunden = await prisma.kunde.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { projekte: true, rechnungen: true } } },
  })
  return NextResponse.json(kunden.map(toKunde))
}

export async function POST(req: Request) {
  const { err } = await requireAdmin()
  if (err) return err
  try {
    const b = await req.json()
    const k = await prisma.kunde.create({
      data: {
        name: b.name, email: b.email, telefon: b.telefon,
        unternehmen: b.unternehmen, paket: b.paket,
        status: b.status || 'Aktiv', notizen: b.notizen,
      },
    })
    return NextResponse.json(toKunde(k))
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
