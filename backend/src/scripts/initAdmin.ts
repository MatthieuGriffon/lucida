import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedAdmin() {
  const adminEmail = 'admin@lucida.dev'
  const adminPassword = 'admin123'

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (existing) {
    console.log(`✅ Admin déjà présent : ${adminEmail}`)
    return
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'Administrateur Lucida',
      role: 'ADMIN',
      password: hashedPassword,
    },
  })

  console.log(`🌱 Admin créé : ${adminEmail} / ${adminPassword}`)
}

seedAdmin()
  .catch((err) => {
    console.error('❌ Erreur lors de la création de l’admin :', err)
  })
  .finally(() => prisma.$disconnect())