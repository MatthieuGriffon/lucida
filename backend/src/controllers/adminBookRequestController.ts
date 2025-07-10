import type { FastifyRequest, FastifyReply } from 'fastify'
import type { FulfillBookRequestInputType } from '@/types/bookRequest'
import { getAllBookRequests as getAll, updateBookRequestStatus } from '@/services/adminBookRequestService'

export async function getAllBookRequests(req: FastifyRequest, res: FastifyReply) {
  const requests = await getAll(req.server)
  res.send(requests)
}

export async function fulfillBookRequest(
  req: FastifyRequest<{ Params: { id: string }; Body: FulfillBookRequestInputType }>,
  res: FastifyReply
) {
  const { id } = req.params
  const { fulfilledTitle, fulfilledAuthor } = req.body

  await updateBookRequestStatus(req.server, id, 'FULFILLED', fulfilledTitle, fulfilledAuthor)
  res.send({ success: true })
}

export async function rejectBookRequest(
  req: FastifyRequest<{ Params: { id: string } }>,
  res: FastifyReply
) {
  const { id } = req.params

  await updateBookRequestStatus(req.server, id, 'REJECTED')
  res.send({ success: true })
}