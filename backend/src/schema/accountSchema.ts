import { Type } from '@sinclair/typebox'

export const ChangePasswordBody = Type.Object({
  oldPassword: Type.String({ minLength: 6 }),
  newPassword: Type.String({ minLength: 6 }),
})

export const DeleteAccountBody = Type.Object({
  password: Type.String({ minLength: 6 }),
})

export const changePasswordSchema = {
  body: ChangePasswordBody,
}

export const deleteAccountSchema = {
  body: DeleteAccountBody,
}