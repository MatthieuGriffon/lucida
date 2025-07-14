export const UserPreferenceResponseSchema = {
  type: 'object',
  properties: {
    fontSize: { type: 'string', pattern: '^\\d+%$' },
    darkMode: { type: 'boolean' },
  },
  required: ['fontSize', 'darkMode'],
}

export const UpdateUserPreferenceBodySchema = {
  type: 'object',
  properties: {
    fontSize: { type: 'string', pattern: '^\\d+%$', minLength: 2, maxLength: 5 },
    darkMode: { type: 'boolean' },
  },
  additionalProperties: false,
  required: [],
}