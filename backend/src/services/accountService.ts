import type { FastifyInstance, FastifyRequest } from 'fastify'
import bcrypt from 'bcrypt'

export async function logoutUser(req: FastifyRequest) {
  req.session.destroy()
}

export async function changeUserPassword(
  fastify: FastifyInstance,
  userId: string,
  oldPassword: string,
  newPassword: string
) {
  const user = await fastify.prisma.user.findUnique({ where: { id: userId } })

  if (!user || !user.password) {
    return { success: false, message: 'Utilisateur non trouvé' }
  }

  const isValid = await bcrypt.compare(oldPassword, user.password)
  if (!isValid) {
    return { success: false, message: 'Mot de passe actuel incorrect' }
  }

  const newHash = await bcrypt.hash(newPassword, 10)
  await fastify.prisma.user.update({
    where: { id: userId },
    data: { password: newHash },
  })

  return { success: true }
}

export async function deleteUserAccount(
  fastify: FastifyInstance,
  userId: string,
  password: string
) {
  const user = await fastify.prisma.user.findUnique({ where: { id: userId } })

  if (!user || !user.password) {
    return { success: false, message: 'Utilisateur non trouvé' }
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return { success: false, message: 'Mot de passe incorrect' }
  }

  await fastify.prisma.user.delete({ where: { id: userId } })

  return { success: true }
}