export const createCompanyWithBranchSwaggerSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'TechCorp Inc.',
      description: 'Name of the company',
    },
    location: {
      type: 'string',
      example: 'San Francisco, CA',
      description: 'Location of the company headquarters',
    },
    // logo: {
    //   type: 'string',
    //   example: 'https://example.com/logo.png',
    //   description: 'Optional URL to the company logo',
    // },
    branches: {
      type: 'array',
      description: 'List of company branches to create',
      items: {
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
      },
    },
  },
  required: ['name', 'location', 'branches'],
};
