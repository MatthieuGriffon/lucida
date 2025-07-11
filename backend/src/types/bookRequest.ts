import { Static, Type } from '@sinclair/typebox'

export const CreateBookRequestInput = Type.Object({
  title: Type.String({ minLength: 1 }),
  author: Type.Optional(Type.String()),
})

export type CreateBookRequestInputType = Static<typeof CreateBookRequestInput>

// ✅ Schéma pour marquer une demande comme satisfaite
export const FulfillBookRequestInput = Type.Object({
  fulfilledTitle: Type.String({ minLength: 1 }),
  fulfilledAuthor: Type.Optional(Type.String()),
})

export type FulfillBookRequestInputType = Static<typeof FulfillBookRequestInput>

export const DeleteBookRequestParams = Type.Object({
  id: Type.String({ format: 'uuid' }),
})