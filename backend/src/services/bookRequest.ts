import type { FastifyInstance } from 'fastify'
import type { CreateBookRequestInputType } from '../types/bookRequest'

export async function createBookRequest(
  fastify: FastifyInstance,
  input: CreateBookRequestInputType,
  userId: string
) {
  return fastify.prisma.bookRequest.create({
    data: {
      title: input.title,
      author: input.author,
      userId,
    },
  })
}

export async function getUserBookRequests(fastify: FastifyInstance, userId: string) {
  return fastify.prisma.bookRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}