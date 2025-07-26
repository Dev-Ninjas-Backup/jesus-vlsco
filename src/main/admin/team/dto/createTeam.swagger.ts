export const createTeamSwaggerSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      example: 'Engineering Team',
    },
    description: {
      type: 'string',
      example: 'Handles all product engineering and devops tasks.',
    },
    department: {
      type: 'string',
      example: 'Engineering',
    },
    image: {
      type: 'string',
      format: 'binary',
      description: 'Team image/logo file',
    },
    members: {
      type: 'array',
      items: {
        type: 'string',
        format: 'uuid',
        example: 'fa24c6d2-09c6-498f-9f84-878cf3871225',
      },
      description: 'Array of user IDs to add as members to the team',
    },
  },
  required: ['title', 'department', 'creatorId','members'],
};
