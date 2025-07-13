export const BookProgressBodySchema = {
  type: 'object',
  properties: {
    bookId: { type: 'string', format: 'uuid' },
    snippet: { type: 'string', minLength: 1, maxLength: 1000 },
  },
  required: ['bookId', 'snippet'],
}

export const BookProgressParamsSchema = {
  type: 'object',
  properties: {
    bookId: { type: 'string', format: 'uuid' },
  },
  required: ['bookId'],
}