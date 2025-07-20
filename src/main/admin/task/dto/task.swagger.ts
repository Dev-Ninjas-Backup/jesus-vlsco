export const addTaskSwaggerSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', example: 'Design Homepage' },
    description: { type: 'string', example: 'Design the main landing page UI' },
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

export const updateTaskSwaggerSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', example: 'Design Homepage v2' },
    description: { type: 'string', example: 'Revised UI for landing page' },
    startTime: {
      type: 'string',
      format: 'date-time',
      example: '2025-08-02T08:00:00Z',
    },
    endTime: {
      type: 'string',
      format: 'date-time',
      example: '2025-08-02T17:00:00Z',
    },
    location: { type: 'string', example: 'Dhaka Main Office' },
    labels: {
      type: 'array',
      items: { type: 'string' },
      example: ['UI', 'Bugfix'],
    },
    attachment: { type: 'string', format: 'binary' },
  },
};
