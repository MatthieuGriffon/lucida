import Fastify from 'fastify'
import prismaPlugin from './plugins/prisma'

const app = Fastify({ logger: true })

app.register(prismaPlugin)

app.get('/', async () => {
  return { message: 'Bienvenue sur Lucida 💫' }
})

app.get('/ping', async () => {
  return { pong: true }
})

const start = async () => {
  try {
    await app.listen({ port: 3000 })
    app.log.info(`🚀 Server listening`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()