import type { FastifyReply } from 'fastify'
import bcrypt from 'bcrypt'
import type { LoginInput } from '@/schema/auth'
import type { PrismaClient } from '@prisma/client'
import type { FastifyInstance } from 'fastify'


export async function loginService(
  prisma: PrismaClient,
  reply: FastifyReply,
  { email, password }: LoginInput
) {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return reply.status(401).send({ error: 'Email ou mot de passe incorrect' })
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
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