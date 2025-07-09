import { FastifyRequest, FastifyReply } from 'fastify'

// isAuthenticated middleware checks if the user is authenticated
export async function isAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (!request.session.user) {
    return reply.status(401).send({ error: 'Non authentifié' })
  }
}

// isAdmin middleware checks if the user has admin privileges
export async function isAdmin(request: FastifyRequest, reply: FastifyReply) {
  if (request.session.user?.role !== 'ADMIN') {
    return reply.status(403).send({ error: 'Accès réservé aux admins' })
  }
}