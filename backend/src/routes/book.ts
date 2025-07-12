import { FastifyInstance, FastifyRequest } from 'fastify'
import { getAllBooks } from '@/services/adminBookService'
import { getBookById } from '@/services/bookService'
import { isAuthenticated } from '@/middlewares/auth'

export async function bookRoutes(app: FastifyInstance) {
  app.get('/books', { preHandler: [isAuthenticated] }, async (req, reply) => {
    const books = await getAllBooks(app)
    return reply.send(books)
  })

app.get(
  '/books/:id',
  {
    preHandler: [isAuthenticated],
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
      },
    },
  },
  async (req, reply) => {
    const { id } = req.params as { id: string }

    const book = await getBookById(app, id)
    if (!book) {
      return reply.status(404).send({ message: 'Livre introuvable' })
    }

    return reply.send(book)
  }
)
}