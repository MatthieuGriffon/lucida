import fp from 'fastify-plugin'
import session from '@fastify/session'
import type { FastifyInstance } from 'fastify'

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(session, {
    secret: process.env.SESSION_SECRET || 'lucida-default-secret', // à remplacer par une vraie clé dans ton .env
    cookie: {
      secure: false, // à mettre à true si tu forces HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 semaine
    },
    saveUninitialized: false,
  })
})