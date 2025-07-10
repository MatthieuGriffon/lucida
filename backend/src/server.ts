import Fastify from 'fastify'
import cors from '@fastify/cors'

import prismaPlugin from './plugins/prisma'
import cookiePlugin from './plugins/cookie'
import sessionPlugin from './plugins/session'
import './scripts/initAdmin'

import { authRoutes } from '@/routes/auth'
import { accountRoutes } from '@/routes/accounts'
import { adminUsersRoutes } from '@/routes/adminUsers'
import bookRequestRoutes from '@/routes/book-request'
import { adminBookRequestRoutes } from '@/routes/adminBookRequest' // ✅ à ajouter

const app = Fastify({ logger: true })

const start = async () => {
  try {
    await app.register(cors, {
      origin: 'http://localhost:5173',
      credentials: true,
    })

    app.register(prismaPlugin)
    app.register(cookiePlugin)
    app.register(sessionPlugin)
    app.register(authRoutes, { prefix: '/api' })
    app.register(accountRoutes, { prefix: '/api' })
    app.register(adminUsersRoutes, { prefix: '/api' })
    app.register(bookRequestRoutes, { prefix: '/api' })
    app.register(adminBookRequestRoutes, { prefix: '/api' })

    app.get('/', async () => {
      return { message: 'Bienvenue sur Lucida 💫' }
    })

    app.get('/ping', async () => {
      return { pong: true }
    })

    await app.listen({ port: 3000 })
    app.log.info(`🚀 Server listening`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()