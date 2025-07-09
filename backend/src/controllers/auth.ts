import type { FastifyRequest, FastifyReply } from 'fastify'
import { loginService } from '@/services/auth'
import type { LoginInput } from '@/types/auth'
import { getCurrentUserService } from '@/services/auth'

export async function loginController(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  const prisma = request.server.prisma
  const user = await loginService(prisma, reply, request.body)

  request.session.user = {
    id: user.id,
    email: user.email,
    role: user.role,
  }

  return reply.send({ message: 'Connexion réussie', user })
}

export async function meController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const sessionUser = request.session.user

  if (!sessionUser) {
    return reply.status(401).send({ error: 'Non authentifié' })
  }

  const user = await getCurrentUserService(request.server, sessionUser.id)

  return reply.send({ user })
}