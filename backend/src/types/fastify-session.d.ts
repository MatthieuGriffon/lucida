import 'fastify'

declare module 'fastify' {
  interface Session {
    user?: {
      id: string
      email: string
      name: string
      role: 'USER' | 'ADMIN'
    }
  }

  interface FastifyRequest {
    destroySession: (callback: (err?: Error) => void) => void
  }
}