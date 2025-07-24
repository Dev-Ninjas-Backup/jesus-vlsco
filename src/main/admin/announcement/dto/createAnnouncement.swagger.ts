export const createAnnouncementSwagger = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      example: 'System Maintenance Notice',
      description: 'Title of the announcement',
    },
    description: {
      type: 'string',
      example: '<p>We’ll be performing maintenance...</p>',
      description: 'Rich text description stored as JSON',
    },
    categoryId: {
      type: 'string',
      example: 'cat_abc123',
      description: 'ID of the selected category',
    },
    publishedNow: {
      type: 'boolean',
      example: false,
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
      example: false,
      description: 'Should recipients get an email notification?',
    },
    enabledReadReceipt: {
      type: 'boolean',
      example: false,
      description: 'Should read receipt tracking be enabled?',
    },
    isForAllUsers: {
      type: 'boolean',
      example: false,
      description: 'Should this announcement be sent to all users?',
    },
    teams: {
      type: 'array',
      description: 'Optional list of teams to notify',
      items: {
        type: 'string',
        example: 'team_abc123',
        description: 'ID of the team',
      },
    },
  },
  required: ['title', 'description', 'categoryId', 'publishedNow'],
};
