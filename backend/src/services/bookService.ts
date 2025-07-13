import { FastifyInstance, FastifyRequest } from 'fastify'


export async function getBookById(
  fastify: FastifyInstance,
  request: FastifyRequest,
  id: string
) {
  const book = await fastify.prisma.book.findUnique({
    where: { id },
  })

  if (!book) return null

  const baseUrl = `${request.protocol}://${request.headers.host}`
  const epubPath = `${baseUrl}/uploads/epub/${book.folderName}/livre.epub`

  return {
    ...book,
    epubPath,
  }
}