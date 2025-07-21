export const addBranchSwagger = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'TechCorp - New York',
      description: 'Branch name',
    },
    location: {
      type: 'string',
      example: 'New York, NY',
      description: 'Branch location',
    },
    managerId: {
      type: 'string',
      example: 'user_abc123',
      description: 'Optional user ID of the branch manager',
    },
  },
  required: ['name', 'location'],
};
