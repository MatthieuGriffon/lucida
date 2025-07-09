import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'
import type { FastifyInstance } from 'fastify'

const prisma = new PrismaClient()

// Fastify plugin pour injecter Prisma proprement
export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async () => {
    await fastify.prisma.$disconnect()
  })
})

// Typage pour éviter les erreurs dans les routes
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}