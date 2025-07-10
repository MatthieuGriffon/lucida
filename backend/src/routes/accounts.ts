import { FastifyInstance } from 'fastify'
import { changePasswordSchema, deleteAccountSchema } from '@/schema/accountSchema'
import { changePasswordHandler, deleteAccountHandler, logoutHandler } from '@/controllers/accountController'
import { isAuthenticated } from '@/middlewares/auth'

export async function accountRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/logout', { preHandler: isAuthenticated }, logoutHandler)
  fastify.post('/account/change-password', {
    preHandler: isAuthenticated,
    schema: changePasswordSchema,
  }, changePasswordHandler)

  fastify.delete('/account/delete', {
    preHandler: isAuthenticated,
    schema: deleteAccountSchema,
  }, deleteAccountHandler)
}