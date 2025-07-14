import { getUserPreference, updateUserPreference } from '@/services/userPreferenceService'
import type { FastifyRequest, FastifyReply } from 'fastify'

export async function getPreferenceController(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.session.user?.id

  if (!userId) {
    return reply.status(401).send({ message: 'Non autorisé' })
  }

  const pref = await getUserPreference(req.server, userId)
  return reply.send({ fontSize: pref.fontSize, darkMode: pref.darkMode })
}

export async function updatePreferenceController(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.session.user?.id

  if (!userId) {
    return reply.status(401).send({ message: 'Non autorisé' })
  }

  const { fontSize, darkMode } = req.body as {
    fontSize: string
    darkMode?: boolean
  }

  const updated = await updateUserPreference(req.server, userId, { fontSize, darkMode })
  return reply.send({ fontSize: updated.fontSize, darkMode: updated.darkMode })
}
