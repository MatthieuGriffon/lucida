import { Type, Static } from '@sinclair/typebox'

export const LoginBody = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
})

export const loginSchema = {
  body: LoginBody,
}

export type LoginInput = Static<typeof LoginBody>