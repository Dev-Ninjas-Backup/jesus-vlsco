import { Department, Gender, JopTitle, UserEnum } from '@prisma/client';

export const swaggerSchema = {
  type: 'object',
  properties: {
    phone: { type: 'string', example: '8801234567890' },
    employeeID: { type: 'integer', example: 1001 },
    email: { type: 'string', example: 'user@example.com' },
    role: { type: 'string', enum: UserEnum },
    firstName: { type: 'string', example: 'John' },
    lastName: { type: 'string', example: 'Doe' },
    gender: { type: 'string', enum: Gender },
    jobTitle: { type: 'string', enum: JopTitle },
    department: { type: 'string', enum: Department },
    address: { type: 'string', example: '123 Street' },
    city: { type: 'string', example: 'Dhaka' },
    state: { type: 'string', example: 'Dhaka Division' },
    dob: {
      type: 'string',
      format: 'date-time',
      example: '1990-01-01T00:00:00Z',
    },
    country: { type: 'string', example: 'Bangladesh' },
    nationality: { type: 'string', example: 'Bangladeshi' },
    password: { type: 'string', example: 'secret123' },
    pinCode: { type: 'integer', example: 1234 },
    profileUrl: { type: 'string', format: 'binary' },
  },
};
