import { FastifyRequest, FastifyReply } from 'fastify'
import {
  getAllUsers,
  createUser,
  updateUserPassword,
  deleteUser,
} from '@/services/adminUsersService'
import { CreateUserBody, UpdatePasswordBody } from '@/schema/adminUsersSchema'

export async function getAllUsersHandler(req: FastifyRequest, reply: FastifyReply) {
  const users = await getAllUsers(req.server)
  return reply.send(users)
}

export async function createUserHandler(req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as typeof CreateUserBody.static

  const result = await createUser(req.server, body)

  if (!result.success) {
    return reply.status(400).send({ error: result.message })
  }

  return reply.send({ success: true })
}

export async function updateUserPasswordHandler(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string }
  const { password } = req.body as typeof UpdatePasswordBody.static

  await updateUserPassword(req.server, {
    userId: id,
    password,
  })

  return reply.send({ success: true })
}

export async function deleteUserHandler(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string }
  await deleteUser(req.server, id)
  return reply.send({ success: true })
}