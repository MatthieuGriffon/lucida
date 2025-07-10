import { Static, Type } from '@sinclair/typebox'

export const CreateBookRequestInput = Type.Object({
  title: Type.String({ minLength: 1 }),
  author: Type.Optional(Type.String()),
})

export type CreateBookRequestInputType = Static<typeof CreateBookRequestInput>