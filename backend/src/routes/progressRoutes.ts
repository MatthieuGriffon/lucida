import { FastifyInstance, FastifyRequest } from 'fastify'
import { upsertBookLoc, getBookLoc } from '@/services/bookProgress'
import { isAuthenticated } from '@/middlewares/auth'

type SessionUser = { id: string }            // adapter si besoin

export async function progressRoutes (fastify: FastifyInstance) {
  /* ---------- POST /progress ----------------------------------------- */
  fastify.post('/progress', {
    schema: {
      body: {
        type:       'object',
        required:   ['bookId', 'loc'],
        properties: {
          bookId: { type: 'string', format: 'uuid' },
          loc:    { type: 'integer', minimum: 0 }
        }
      },
      response: { 204: { type: 'null' }, 401: { type: 'null' } }
    },
    preHandler: [isAuthenticated]
  }, async (req: FastifyRequest, reply) => {
    const user    = (req.session as any).user as SessionUser | undefined
    if (!user)    return reply.code(401).send()

    const { bookId, loc } = req.body as { bookId: string; loc: number }
    await upsertBookLoc(fastify, user.id, bookId, loc)

    return reply.code(204).send()
  })

  /* ---------- GET /progress/:bookId ---------------------------------- */
  fastify.get('/progress/:bookId', {
    schema: {
      params: {
        type: 'object',
        properties: { bookId: { type: 'string', format: 'uuid' } }
      },
      response: {
        200: { type: 'object', properties: { loc: { type: 'integer' } } },
        204: { type: 'null' },
        401: { type: 'null' }
      }
    },
    preHandler: [isAuthenticated]
  }, async (req: FastifyRequest, reply) => {
    const user = (req.session as any).user as SessionUser | undefined
    if (!user)  return reply.code(401).send()

    const { bookId } = req.params as { bookId: string }
    const progress   = await getBookLoc(fastify, user.id, bookId)

    return progress
      ? reply.send({ loc: progress.loc })
      : reply.code(204).send()
  })
}