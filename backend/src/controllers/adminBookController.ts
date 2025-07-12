import { FastifyRequest, FastifyReply } from 'fastify'
import { createBook, deleteBook, getAllBooks, updateBook } from '@/services/adminBookService'
import { pipeline } from 'stream'
import { promisify } from 'util'
import { createWriteStream } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { slugify } from '@/utils/slugify'

const pump = promisify(pipeline)

export async function getAllBooksController(req: FastifyRequest, reply: FastifyReply) {
  const books = await getAllBooks(req.server)
  return reply.send(books)
}

export async function createBookController(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.session.user?.id
  if (!userId) return reply.status(401).send({ message: 'Non authentifié' })

  const body = req.body as {
    title: string
    author?: string
    epubPath: string
  }

  const book = await createBook(req.server, body, userId)
  return reply.code(201).send(book)
}

export async function updateBookController(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const id = req.params.id
  const body = req.body as {
    title?: string
    author?: string
    epubPath?: string
  }

  const updated = await updateBook(req.server, id, body)
  return reply.send(updated)
}

export async function deleteBookController(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const id = req.params.id
  await deleteBook(req.server, id)
  return reply.code(204).send()
}

export async function uploadBookFileController(req: FastifyRequest, reply: FastifyReply) {
  console.log('📥 Contrôleur uploadBookFileController appelé')

  let title = ''
  let author = 'inconnu'
  let epubFilePath = ''
  let uploadFileName = ''

  const parts = req.parts()

  for await (const part of parts) {
    if (part.type === 'file' && part.fieldname === 'file') {
      if (!part.filename) continue

      uploadFileName = part.filename
      const slug = slugify(`${Date.now()}-${uploadFileName}`)
      const uploadDir = path.join(process.cwd(), '..', 'uploads', 'epub', slug)
      await fs.mkdir(uploadDir, { recursive: true })

      const fullPath = path.join(uploadDir, 'livre.epub')
      epubFilePath = `uploads/epub/${slug}/livre.epub`

      console.log('🖊️ Écriture du fichier en cours…', fullPath)
      await pump(part.file, createWriteStream(fullPath))
      console.log('✅ Fichier copié')
    }

   if (part.type === 'field' && typeof part.value === 'string') {
  if (part.fieldname === 'title') title = part.value.trim()
  if (part.fieldname === 'author') author = part.value.trim() || 'inconnu'
}
  }

  if (!title || !epubFilePath) {
    console.log('⚠️ Champs manquants :', { title, epubFilePath })
    return reply.status(400).send({ message: 'Champs manquants ou fichier invalide' })
  }

  return reply.send({ epubPath: epubFilePath })
}