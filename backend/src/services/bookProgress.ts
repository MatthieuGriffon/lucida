import type { FastifyInstance } from 'fastify'

/**
 * Insère ou met à jour la progression (index book.locations)
 */
export async function upsertBookLoc(
  fastify: FastifyInstance,
  userId: string,
  bookId: string,
  loc: number
) {
  await fastify.prisma.bookProgress.upsert({
    where: { userId_bookId: { userId, bookId } },
    update: { loc, updatedAt: new Date() },
    create: { userId, bookId, loc }
  })
}

/**
 * Récupère la progression d'un livre pour l'utilisateur courant
 */
export async function getBookLoc(
  fastify: FastifyInstance,
  userId: string,
  bookId: string
) {
  return fastify.prisma.bookProgress.findUnique({
    where: { userId_bookId: { userId, bookId } },
    select: { loc: true }          // { loc: 123 } | null
  })
}