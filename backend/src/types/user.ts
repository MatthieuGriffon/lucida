import type { Static } from '@sinclair/typebox'
import { CreateUserSchema } from '@/schema/user'

export type CreateUserInput = Static<typeof CreateUserSchema>