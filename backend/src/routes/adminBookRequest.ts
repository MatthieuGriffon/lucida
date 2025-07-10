import { FastifyInstance } from 'fastify'
import { isAdmin } from '@/middlewares/auth'
import { getAllBookRequests, fulfillBookRequest, rejectBookRequest } from '@/controllers/adminBookRequestController'
import { FulfillBookRequestInput } from '@/types/bookRequest'

export async function adminBookRequestRoutes(app: FastifyInstance) {
  app.get('/admin/book-requests', {
    preHandler: [isAdmin],
    handler: getAllBookRequests,
  })

  app.post('/admin/book-requests/:id/fulfill', {
    preHandler: [isAdmin],
    schema: {
      body: FulfillBookRequestInput,
    },
    handler: fulfillBookRequest,
  })

  app.post('/admin/book-requests/:id/reject', {
    preHandler: [isAdmin],
    handler: rejectBookRequest,
  })
}
