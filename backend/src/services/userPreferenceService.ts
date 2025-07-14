import { FastifyInstance } from 'fastify'

type PreferenceData = {
  fontSize: string
  darkMode?: boolean // ← optionnel maintenant
}

export async function getUserPreference(fastify: FastifyInstance, userId: string) {
  const pref = await fastify.prisma.userPreference.findUnique({
    where: { userId },
  })

  return pref ?? { fontSize: '125%', darkMode: false } // Valeurs par défaut
}

export async function updateUserPreference(
  fastify: FastifyInstance,
  userId: string,
  data: PreferenceData
) {
  return fastify.prisma.userPreference.upsert({
    where: { userId },
    create: {
      userId,
      fontSize: data.fontSize,
      darkMode: data.darkMode ?? false,
    },
    update: {
      fontSize: data.fontSize,
       ...(data.darkMode !== undefined && { darkMode: data.darkMode }),
    },
  })
}

