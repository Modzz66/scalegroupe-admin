import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const admins = [
    {
      name: 'Kevin Ochs',
      email: 'kevin@scalegroupe.de',
      password: 'admin123',
    },
    {
      name: 'Damian Rzepta',
      email: 'damian@scalegroupe.de',
      password: 'admin123',
    },
  ]

  for (const admin of admins) {
    const existing = await prisma.user.findUnique({ where: { email: admin.email } })
    if (existing) {
      console.log(`Account bereits vorhanden: ${admin.email}`)
      continue
    }

    const hashed = await bcrypt.hash(admin.password, 12)
    await prisma.user.create({
      data: {
        name: admin.name,
        email: admin.email,
        password: hashed,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    })
    console.log(`Admin erstellt: ${admin.name} <${admin.email}>`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
