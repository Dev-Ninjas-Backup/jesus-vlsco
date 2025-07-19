import { VisibilityType } from '@prisma/client';

export const addRecognitionSwaggerScham = {
  type: 'object',
  properties: {
    badgeId: {
      type: 'string',
      example: 'c7f05a0e-1234-4abc-8a93-87f0145719e6',
      description: 'The ID of the badge to associate with this recognition',
    },
    message: {
      type: 'string',
      example: 'Well done on completing the project!',
      description: 'The message to be shared with the recipients',
    },
    visibility: {
      type: 'string',
      enum: [
        VisibilityType.Only_Recipient,
        VisibilityType.All_user_in_the_company,
        VisibilityType.Specific_user_in_the_company,
      ],
      example: VisibilityType.All_user_in_the_company,
      description: 'Defines who can see this recognition',
    },
    shouldNotify: {
      type: 'boolean',
      example: true,
      description: 'Whether to send notifications to the recipients',
    },
    isAllowedToLike: {
      type: 'boolean',
      example: true,
      description: 'Whether other users can like this recognition',
    },
    recognitionUserIds: {
      type: 'array',
      items: {
        type: 'string',
        format: 'uuid',
      },
      example: [
        'd27f0c35-a2f9-4827-b0ce-f33eab91b789',
        'e14d5f6a-dc65-4e88-814f-59cdfe25bb62',
      ],
      description: 'User IDs to assign this recognition to',
    },
  },
};
