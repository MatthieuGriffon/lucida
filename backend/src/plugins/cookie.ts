import fp from 'fastify-plugin'
import cookie from '@fastify/cookie'
import type { FastifyInstance } from 'fastify'

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(cookie, {
    secret: 'lucida-super-secret-key', // 🔐 à remplacer par une vraie clé secrète (env)
    hook: 'onRequest',
    parseOptions: {}, // tu peux préciser `httpOnly`, `secure`, etc.
  })
})