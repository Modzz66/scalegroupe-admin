import { prisma } from '@/lib/prisma'
import { requireSession } from '@/lib/api-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const { session, err } = await requireSession()
  if (err) return err
  const kunde = await prisma.kunde.findUnique({ where: { userId: session!.user.id } })
  if (!kunde) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const feedbacks = await prisma.feedback.findMany({
    where: { kundeId: kunde.id },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(feedbacks)
}

export async function POST(req: Request) {
  const { session, err } = await requireSession()
  if (err) return err
  const kunde = await prisma.kunde.findUnique({ where: { userId: session!.user.id } })
  if (!kunde) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const b = await req.json()
    const f = await prisma.feedback.create({
      data: { bewertung: parseInt(b.bewertung), kommentar: b.kommentar, kundeId: kunde.id },
    })
    return NextResponse.json(f)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
