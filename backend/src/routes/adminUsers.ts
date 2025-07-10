import { FastifyInstance } from 'fastify'
import {
  createUserSchema,
  updatePasswordSchema,
} from '@/schema/adminUsersSchema'
import {
  getAllUsersHandler,
  createUserHandler,
  updateUserPasswordHandler,
  deleteUserHandler,
} from '@/controllers/adminUsersController'
import { isAdmin } from '@/middlewares/auth'

export async function adminUsersRoutes(fastify: FastifyInstance) {
  fastify.get('/admin/users', { preHandler: isAdmin }, getAllUsersHandler)

  fastify.post('/admin/users', {
    preHandler: isAdmin,
    schema: createUserSchema,
  }, createUserHandler)

  fastify.put('/admin/users/:id/password', {
    preHandler: isAdmin,
    schema: updatePasswordSchema,
  }, updateUserPasswordHandler)

  fastify.delete('/admin/users/:id', {
    preHandler: isAdmin,
  }, deleteUserHandler)
}