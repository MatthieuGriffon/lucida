import type { FastifyInstance } from 'fastify'
import { loginSchema } from '@/schema/auth'
import { loginController } from '@/controllers/auth'
import { meController } from '@/controllers/auth'
import { isAuthenticated } from '@/middlewares/auth'


export async function authRoutes(app: FastifyInstance) {
   app.log.info('✅ Routes /auth enregistrées')

  app.post('/auth/login', {
    schema: loginSchema,
    handler: loginController,
  }),
  app.get('/auth/me', { preHandler: isAuthenticated }, meController)
}