import { Type } from '@sinclair/typebox'

export const CreateUserSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
  name: Type.String({ minLength: 2 }),
  role: Type.Optional(Type.Enum({ USER: 'USER', ADMIN: 'ADMIN' })),
})

export const createUserSchema = {
  body: CreateUserSchema,
}