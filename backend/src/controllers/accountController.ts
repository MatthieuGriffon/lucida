import { FastifyRequest, FastifyReply } from 'fastify'
import { changeUserPassword, deleteUserAccount, logoutUser } from '@/services/accountService'

export async function logoutHandler(req: FastifyRequest, reply: FastifyReply) {
  await logoutUser(req)
  reply.clearCookie('sessionId')
  return reply.send({ success: true })
}

export async function changePasswordHandler(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.session.user?.id
  const { oldPassword, newPassword } = req.body as { oldPassword: string; newPassword: string }

  if (!userId) {
    return reply.status(401).send({ error: 'Non autorisé' })
  }

  const result = await changeUserPassword(req.server, userId, oldPassword, newPassword)
  if (!result.success) {
    return reply.status(400).send({ error: result.message })
  }

  return reply.send({ success: true })
}

export async function deleteAccountHandler(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.session.user?.id
  const { password } = req.body as { password: string }

  if (!userId) {
    return reply.status(401).send({ error: 'Non autorisé' })
  }

  const result = await deleteUserAccount(req.server, userId, password)
  if (!result.success) {
    return reply.status(400).send({ error: result.message })
  }

  req.session.destroy()
  reply.clearCookie('sessionId')

  return reply.send({ success: true })
}
