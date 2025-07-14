import { FastifyInstance } from 'fastify'

export async function getUserPreference(fastify: FastifyInstance, userId: string) {
  const pref = await fastify.prisma.userPreference.findUnique({
    where: { userId },
  })

  return pref ?? { fontSize: '125%' } // défaut si aucune préférénce trouvée
}

export async function updateUserPreference(
  fastify: FastifyInstance,
  userId: string,
  data: { fontSize: string }
) {
  return fastify.prisma.userPreference.upsert({
    where: { userId },
    create: {
      userId,
      fontSize: data.fontSize,
    },
    update: {
      fontSize: data.fontSize,
    },
  })
}