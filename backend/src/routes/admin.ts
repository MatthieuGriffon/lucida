import type { FastifyInstance } from 'fastify'
import { isAdmin } from '@/middlewares/auth'
import { createUserSchema } from '@/schema/user'
import { createUserController } from '@/controllers/createUserController'

export async function adminRoutes(app: FastifyInstance) {
  app.post('/admin/users', {
    preHandler: [isAdmin],
    schema: createUserSchema,
  }, createUserController)
}