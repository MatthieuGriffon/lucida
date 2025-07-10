import { Type } from '@sinclair/typebox'

export const CreateUserBody = Type.Object({
  name: Type.String({ minLength: 2 }),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
  role: Type.Union([Type.Literal('USER'), Type.Literal('ADMIN')]),
})

export const UpdatePasswordBody = Type.Object({
  password: Type.String({ minLength: 6 }),
})

export const createUserSchema = { body: CreateUserBody }
export const updatePasswordSchema = { body: UpdatePasswordBody }
