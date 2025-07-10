import type { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'
import type { CreateUserInput, UpdateUserPasswordInput } from '@/types/adminUsers'

export async function getAllUsers(fastify: FastifyInstance) {
  return fastify.prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createUser(fastify: FastifyInstance, data: CreateUserInput) {
  const existing = await fastify.prisma.user.findUnique({ where: { email: data.email } })
  if (existing) {
    return { success: false, message: 'Email déjà utilisé' }
  }

  const hash = await bcrypt.hash(data.password, 10)
  await fastify.prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      password: hash,
    },
  })

  return { success: true }
}

export async function updateUserPassword(fastify: FastifyInstance, { userId, password }: UpdateUserPasswordInput) {
  const hash = await bcrypt.hash(password, 10)
  await fastify.prisma.user.update({
    where: { id: userId },
    data: { password: hash },
  })

  return { success: true }
}

export async function deleteUser(fastify: FastifyInstance, userId: string) {
  await fastify.prisma.user.delete({ where: { id: userId } })
  return { success: true }
}
