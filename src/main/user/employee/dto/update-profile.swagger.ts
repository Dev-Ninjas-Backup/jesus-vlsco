import { Gender } from '@prisma/client';

export const updateProfileSwaggerSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', example: 'user@example.com' },
    phone: { type: 'string', example: '+8801234567890' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    gender: { type: 'string', enum: [Gender.MALE, Gender.FEMALE] },
    address: { type: 'string' },
    city: { type: 'string' },
    state: { type: 'string' },
    dob: { type: 'string', format: 'date-time' },
    country: { type: 'string' },
    nationality: { type: 'string' },
    password: { type: 'string' },
    pinCode: { type: 'integer', example: 1234 },
    profileUrl: { type: 'string', format: 'binary' },
  },
};
