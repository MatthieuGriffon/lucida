import 'fastify'

declare module 'fastify' {
  interface Session {
    user?: {
      id: string
      email: string
      role: string
    }
  }
   interface FastifyRequest {
    destroySession: (callback: (err?: Error) => void) => void
  }
}