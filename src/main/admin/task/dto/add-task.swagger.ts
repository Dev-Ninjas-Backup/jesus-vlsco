export const addTaskSwaggerSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', example: 'Design Homepage' },
    description: { type: 'string', example: 'Design the main landing page UI' },
    projectId: {
      type: 'string',
      example: '123e4567-e89b-12d3-a456-426614174000',
    },
    startTime: {
      type: 'string',
      format: 'date-time',
      example: '2025-08-01T08:00:00Z',
    },
    endTime: {
      type: 'string',
      format: 'date-time',
      example: '2025-08-01T17:00:00Z',
    },
    location: { type: 'string', example: 'Dhaka Office' },
    labels: {
      type: 'array',
      items: { type: 'string' },
      example: ['UI', 'High Priority'],
    },
  },
};
