console.log('✅ [book-request] routes enregistrées')
import type { FastifyInstance } from 'fastify'
import { postBookRequest,getBookRequests,deleteBookRequestHandler } from '@/controllers/bookRequestController'
import { CreateBookRequestInput,DeleteBookRequestParams } from '@/types/bookRequest'
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
  app.delete('/book-request/:id', {
    preHandler: [isAuthenticated],
    schema: {
      params: DeleteBookRequestParams,
    },
    handler: deleteBookRequestHandler,
  })
}