
export const updateCompanyWithBranchesSwagger = {
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        example: 'TechCorp Global',
        description: 'Updated name of the company',
      },
      location: {
        type: 'string',
        example: 'Austin, TX',
        description: 'Updated company headquarters location',
      },
      logo: {
        type: 'string',
        example: 'https://example.com/new-logo.png',
        description: 'Optional updated company logo URL',
      },
      branches: {
        type: 'array',
        description: 'List of existing branches to update (only changed fields)',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'branch_abc123',
              description: 'Branch ID to be updated (required)',
            },
            name: {
              type: 'string',
              example: 'TechCorp - NYC HQ',
              description: 'Updated branch name',
            },
            location: {
              type: 'string',
              example: 'New York, NY',
              description: 'Updated branch location',
            },
            managerId: {
              type: 'string',
              example: 'user_456xyz',
              description: 'Optional updated branch manager ID',
            },
          },
          required: ['id'],
        },
      },
    },
    required: [],
  },
};
