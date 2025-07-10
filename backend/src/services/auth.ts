import bcrypt from 'bcrypt'
import type { LoginInput } from '@/schema/auth'
import type { PrismaClient } from '@prisma/client'
import type { FastifyInstance } from 'fastify'


export async function loginService(
  prisma: PrismaClient,
  data: LoginInput
) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (!user) return null

  const passwordMatch = await bcrypt.compare(data.password, user.password)
  if (!passwordMatch) return null

  return user
}

export async function getCurrentUserService(
  fastify: FastifyInstance,
  userId: string
) {
  const user = await fastify.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })

  if (!user) {
    const error = new Error('Utilisateur non trouvé')
    ;(error as any).statusCode = 404
    throw error
  }

  return user
}