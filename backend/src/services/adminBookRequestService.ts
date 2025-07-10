import type { FastifyInstance } from 'fastify'
import type { RequestStatus } from '@prisma/client'

export async function getAllBookRequests(fastify: FastifyInstance) {
  return fastify.prisma.bookRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

export async function updateBookRequestStatus(
  fastify: FastifyInstance,
  requestId: string,
  status: RequestStatus,
  fulfilledTitle?: string,
  fulfilledAuthor?: string
) {
  return fastify.prisma.bookRequest.update({
    where: { id: requestId },
    data: {
      status,
      fulfilledBookTitle: status === 'FULFILLED' ? fulfilledTitle : null,
      fulfilledBookAuthor: status === 'FULFILLED' ? fulfilledAuthor : null,
    },
  })
}