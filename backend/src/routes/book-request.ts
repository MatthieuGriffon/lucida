console.log('✅ [book-request] routes enregistrées')
import type { FastifyInstance } from 'fastify'
import { postBookRequest,getBookRequests } from '@/controllers/bookRequestController'
import { CreateBookRequestInput } from '@/types/bookRequest'
import { isAuthenticated } from '@/middlewares/auth'

export default async function bookRequestRoutes(app: FastifyInstance) {
  app.post('/book-request', {
    preHandler: [isAuthenticated],
    schema: {
      body: CreateBookRequestInput,
    },
    handler: postBookRequest,
  })
  app.get('/book-request', {
    preHandler: [isAuthenticated],
    handler: getBookRequests,
  })
}