import Fastify from 'fastify'
import prismaPlugin from './plugins/prisma'
import cookiePlugin from './plugins/cookie'
import sessionPlugin from './plugins/session'
import '@/types/fastify-session'


const app = Fastify({ logger: true })

app.register(prismaPlugin)
app.register(cookiePlugin)
app.register(sessionPlugin)

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