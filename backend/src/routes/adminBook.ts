import { FastifyInstance } from 'fastify'
import { isAdmin } from '@/middlewares/auth'
import * as adminBookController from '@/controllers/adminBookController'

export async function adminBookRoutes(fastify: FastifyInstance) {
  fastify.register(async (adminScope) => {
    adminScope.addHook('onRequest', isAdmin)

    adminScope.get('/admin/books', adminBookController.getAllBooksController)
    adminScope.post('/admin/book', adminBookController.createBookController)
    adminScope.put('/admin/book/:id', adminBookController.updateBookController)
    adminScope.delete('/admin/book/:id', adminBookController.deleteBookController)
    adminScope.post('/admin/book/upload', adminBookController.uploadBookFileController)
  })
}