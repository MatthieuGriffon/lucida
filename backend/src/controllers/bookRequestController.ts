import type { FastifyRequest, FastifyReply } from 'fastify'
import { createBookRequest } from '@/services/bookRequest'
import { CreateBookRequestInput } from '@/types/bookRequest'
import { getUserBookRequests } from '@/services/bookRequest'

export async function postBookRequest(req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as typeof CreateBookRequestInput.static
  const userId = req.session.user?.id

  if (!userId) {
    return reply.status(401).send({ message: 'Non autorisé' })
  }

  const newRequest = await createBookRequest(req.server, body, userId)
  reply.code(201).send(newRequest)
}

export async function getBookRequests(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.session.user?.id

  if (!userId) {
    return reply.status(401).send({ message: 'Non autorisé' })
  }

  const requests = await getUserBookRequests(req.server, userId)
  reply.send(requests)
}