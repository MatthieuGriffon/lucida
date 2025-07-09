import type { CreateUserInput } from '@/types/user'
import type { FastifyInstance } from 'fastify'
import bcrypt from 'bcrypt'

export async function createUserService(
  fastify: FastifyInstance,
  input: CreateUserInput
) {
  const hashedPassword = await bcrypt.hash(input.password, 10)

  const user = await fastify.prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      name: input.name,
      role: input.role || 'USER',
    },
  })

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}