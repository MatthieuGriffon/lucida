import { FastifyInstance } from 'fastify'

export async function getAllBooks(fastify: FastifyInstance) {
  return fastify.prisma.book.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      addedBy: { select: { id: true, name: true } },
    },
  })
}

export async function createBook(
  fastify: FastifyInstance,
  data: { title: string; author?: string; epubPath: string },
  userId: string
) {
  return fastify.prisma.book.create({
    data: {
      title: data.title,
      author: data.author ?? '',
      epubPath: data.epubPath,
      addedById: userId,
    },
  })
}

export async function updateBook(
  fastify: FastifyInstance,
  id: string,
  data: { title?: string; author?: string; epubPath?: string }
) {
  return fastify.prisma.book.update({
    where: { id },
    data,
  })
}

export async function deleteBook(fastify: FastifyInstance, id: string) {
  return fastify.prisma.book.delete({
    where: { id },
  })
}