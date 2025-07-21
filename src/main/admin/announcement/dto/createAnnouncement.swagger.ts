// model Announcement{
//     id          String   @id @default(cuid())
//     title       String
//     description Json
//     audience    String
//     createdBy   String
//     likeCount   Int      @default(0)
//     viewCount   Int      @default(0)
//     publishedNow Boolean @default(false)
//     publishedAt DateTime?
//     sendEmailNotification Boolean @default(false)
//     enabledReadReceipt Boolean @default(false)
//     categoryId  String
//     Attachments Attachments[]
//     createdAt   DateTime @default(now())
//     updatedAt   DateTime @updatedAt
//     likedUser  AnnoucementReactedUser[]

//     author      User      @relation(fields: [createdBy], references: [id])
//     category    AnnouncementCategory @relation(fields: [categoryId], references: [id])
// }

// model AnnoucementReactedUser {
//     id          String   @id @default(cuid())
//     userId      String
//     announcementId String
//     createdAt   DateTime @default(now())
//     updatedAt   DateTime @updatedAt

//     user        User     @relation(fields: [userId], references: [id])
//     announcement Announcement @relation(fields: [announcementId], references: [id])

// }

// model Attachments {
//     id          String   @id @default(cuid())
//     file         String
//     announcementId String
//     createdAt   DateTime @default(now())
//     updatedAt   DateTime @updatedAt

//     announcement Announcement @relation(fields: [announcementId], references: [id])
// }

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
      example: { content: '<p>We’ll be performing maintenance...</p>' },
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
