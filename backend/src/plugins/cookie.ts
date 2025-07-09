import fp from 'fastify-plugin'
import cookie from '@fastify/cookie'
import type { FastifyInstance } from 'fastify'

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(cookie, {
    secret: process.env.SESSION_SECRET!, 
    hook: 'onRequest',
    parseOptions: {}, 
  })
})