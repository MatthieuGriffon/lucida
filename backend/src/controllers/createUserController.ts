import type { FastifyRequest, FastifyReply } from 'fastify'
import { createUserService } from '@/services/user'

export async function createUserController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = await createUserService(request.server, request.body as any)
  return reply.status(201).send({ message: 'Utilisateur créé', user })
}