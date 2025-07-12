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
  const folderName = data.epubPath.split('/').slice(-2, -1)[0]

  return fastify.prisma.book.create({
    data: {
      title: data.title,
      author: data.author ?? '',
      epubPath: data.epubPath,
      addedById: userId,
      folderName, // ✅ obligatoire depuis ta dernière migration
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

export async function getBookById(app: FastifyInstance, id: string) {
  return await app.prisma.book.findUnique({
    where: { id },
  })
}