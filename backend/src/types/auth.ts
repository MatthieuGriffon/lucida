import { Static } from '@sinclair/typebox'
import { LoginBody } from '../schema/auth'

export type LoginInput = Static<typeof LoginBody>