import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import path from 'path'
import prismaPlugin from './plugins/prisma'
import cookiePlugin from './plugins/cookie'
import sessionPlugin from './plugins/session'
import './scripts/initAdmin'
import mime from 'mime'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import { authRoutes } from '@/routes/auth'
import { accountRoutes } from '@/routes/accounts'
import { adminUsersRoutes } from '@/routes/adminUsers'
import bookRequestRoutes from '@/routes/book-request'
import { adminBookRequestRoutes } from '@/routes/adminBookRequest'
import { adminBookRoutes } from '@/routes/adminBook'
import { bookRoutes } from '@/routes/book'
import { progressRoutes } from '@/routes/progressRoutes'
import fastifyMultipart from '@fastify/multipart'



const app = Fastify({ logger: true })
console.log('📂 Static path:', join(__dirname, '..', '..', 'uploads'))

app.register(fastifyStatic, {
  root: join(__dirname, '..', '..', 'uploads'), // ← remonte plus haut
  prefix: '/uploads/',
  setHeaders(res, path) {
    const type = mime.getType(path)
    if (type) {
      res.setHeader('Content-Type', type)
    }
  }
})

const start = async () => {
  try {
   await app.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://192.168.1.28:5173'
    ]
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true)
    } else {
      cb(new Error("Not allowed"), false)
    }
  },
  credentials: true,
})

    app.register(prismaPlugin)
    app.register(cookiePlugin)
    app.register(sessionPlugin) 
    app.register(fastifyMultipart, {
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 Mo
  }
})
    app.register(authRoutes, { prefix: '/api' })
    app.register(accountRoutes, { prefix: '/api' })
    app.register(adminUsersRoutes, { prefix: '/api' })
    app.register(bookRequestRoutes, { prefix: '/api' })
    app.register(adminBookRequestRoutes, { prefix: '/api' })
    app.register(adminBookRoutes, { prefix: '/api' })
    app.register(bookRoutes, { prefix: '/api' })
    app.register(progressRoutes, { prefix: '/api' })

    app.get('/', async () => {
      return { message: 'Bienvenue sur Lucida 💫' }
    })

    app.get('/ping', async () => {
      return { pong: true }
    })
    app.printRoutes()
    await app.listen({ port: 3000,host: '0.0.0.0' })
    app.log.info(`🚀 Server listening`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()