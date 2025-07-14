export const UserPreferenceResponseSchema = {
  type: 'object',
  properties: {
    fontSize: { type: 'string', pattern: '^\\d+%$' }, 
  },
  required: ['fontSize'],
}

export const UpdateUserPreferenceBodySchema = {
  type: 'object',
  properties: {
    fontSize: { type: 'string', pattern: '^\\d+%$', minLength: 2, maxLength: 5 },
  },
  required: ['fontSize'],
}