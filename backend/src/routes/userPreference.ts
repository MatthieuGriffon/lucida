import { FastifyInstance } from 'fastify'
import { getPreferenceController, updatePreferenceController } from '@/controllers/userPreferenceController'
import { isAuthenticated } from '@/middlewares/auth'
import {
  UserPreferenceResponseSchema,
  UpdateUserPreferenceBodySchema,
} from '@/schema/userPreferenceSchema'

export default async function userPreferenceRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: 'GET',
    url: '/preference',
    onRequest: [isAuthenticated],
    schema: {
      response: {
        200: UserPreferenceResponseSchema,
      },
    },
    handler: getPreferenceController,
  })

  fastify.route({
    method: 'PATCH',
    url: '/preference',
    onRequest: [isAuthenticated],
    schema: {
      body: UpdateUserPreferenceBodySchema,
      response: {
        200: UserPreferenceResponseSchema,
      },
    },
    handler: updatePreferenceController,
  })
}