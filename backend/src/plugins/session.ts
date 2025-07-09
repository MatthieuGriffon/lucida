import fp from 'fastify-plugin'
import session from '@fastify/session'
import type { FastifyInstance } from 'fastify'

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(session, {
    secret: process.env.SESSION_SECRET!,
    cookie: {
      secure: false, // à mettre true en prod si HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
    },
    saveUninitialized: false,
  })
})