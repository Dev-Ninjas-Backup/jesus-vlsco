import { BadgeCategory } from '@prisma/client';

export const addBadgeSwaggerSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', example: 'Creative' },
    category: {
      type: 'string',
      enum: [
        BadgeCategory.ANNIVERSARY,
        BadgeCategory.PROMOTION,
        BadgeCategory.GOOD_JOB,
        BadgeCategory.PROMOTION,
      ],
      example: BadgeCategory.GOOD_JOB,
    },
  },
};
