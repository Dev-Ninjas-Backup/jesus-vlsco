export const createAnnouncementSwagger = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      example: 'System Maintenance Notice',
      description: 'Title of the announcement',
    },
    description: {
      type: 'object',
      example: '<p>We’ll be performing maintenance...</p>',
      description: 'Rich text description stored as JSON',
    },
    audience: {
      type: 'string',
      example: 'ALL_EMPLOYEES',
      description: 'Target audience for the announcement',
    },
    categoryId: {
      type: 'string',
      example: 'cat_abc123',
      description: 'ID of the selected category',
    },
    publishedNow: {
      type: 'boolean',
      example: true,
      description: 'Whether to publish immediately or schedule it',
    },
    publishedAt: {
      type: 'string',
      format: 'date-time',
      example: '2025-07-21T10:00:00.000Z',
      description: 'Optional future publish time if not publishing now',
    },
    sendEmailNotification: {
      type: 'boolean',
      example: true,
      description: 'Should recipients get an email notification?',
    },
    enabledReadReceipt: {
      type: 'boolean',
      example: false,
      description: 'Should read receipt tracking be enabled?',
    },
  },
  required: ['title', 'description', 'audience', 'categoryId', 'publishedNow'],
};
