import { FastifyInstance } from 'fastify'

export async function getBookById(fastify: FastifyInstance, id: string) {
  const book = await fastify.prisma.book.findUnique({
    where: { id },
  })

  if (!book) return null

  const epubPath = `http://localhost:3000/uploads/epub/${book.folderName}/livre.epub`

  return {
    ...book,
    epubPath,
  }
}