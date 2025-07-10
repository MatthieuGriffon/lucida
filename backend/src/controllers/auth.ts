import type { FastifyRequest, FastifyReply } from 'fastify'
import { loginService } from '@/services/auth'
import type { LoginInput } from '@/types/auth'
import { getCurrentUserService } from '@/services/auth'

export async function loginController(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  console.log('📥 Reçu POST /auth/login avec :', request.body)

  const prisma = request.server.prisma
  const user = await loginService(prisma, request.body)

  if (!user) {
    console.log('❌ Utilisateur non trouvé ou mot de passe incorrect')
    return reply.status(401).send({ error: 'Email ou mot de passe incorrect' })
  }

  request.session.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name, // Assurez-vous que le nom est inclus dans l'objet utilisateur
  }

  return reply.send({ message: 'Connexion réussie', user })
}

export async function meController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const sessionUser = request.session.user

  if (!sessionUser) {
    return reply.status(401).send({ error: 'Non authentifié' })
  }

  const user = await getCurrentUserService(request.server, sessionUser.id)

  return reply.send({ user })
}