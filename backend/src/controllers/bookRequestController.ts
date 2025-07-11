import type { FastifyRequest, FastifyReply } from 'fastify'
import { createBookRequest } from '@/services/bookRequest'
import { CreateBookRequestInput } from '@/types/bookRequest'
import { getUserBookRequests } from '@/services/bookRequest'
import { deleteBookRequest } from '@/services/bookRequest'

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

export async function deleteBookRequestHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const user = request.session.user!

  const result = await deleteBookRequest(request.server, id, user.id, user.role === 'ADMIN')

  if (result === null) {
    return reply.status(404).send({ message: 'Demande non trouvée' })
  }

  if (result === false) {
    return reply.status(403).send({ message: 'Non autorisé à supprimer cette demande' })
  }

  return reply.status(204).send()
}