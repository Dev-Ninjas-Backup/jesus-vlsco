import { Department, Gender, JopTitle, UserEnum } from '@prisma/client';

export const swaggerSchema = {
  type: 'object',
  properties: {
    phone: { type: 'string', example: '8801234567890' },
    employeeID: { type: 'integer', example: 1001 },
    email: { type: 'string', example: 'user@example.com' },
    role: {
      type: 'string',
      enum: [UserEnum.ADMIN, UserEnum.EMPLOYEE, UserEnum.MANAGER],
      example: UserEnum.EMPLOYEE,
    },
    firstName: { type: 'string', example: 'John' },
    lastName: { type: 'string', example: 'Doe' },
    gender: {
      type: 'string',
      enum: [Gender.MALE, Gender.FEMALE],
      example: Gender.MALE,
    },
    jobTitle: {
      type: 'string',
      enum: [JopTitle.DATA_ENGINEER, JopTitle.DATA_SCIENTIST],
      example: JopTitle.DATA_ENGINEER,
    },
    department: {
      type: 'string',
      enum: [Department.DEVELOPMENT, Department.HR],
      example: Department.DEVELOPMENT,
    },
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

export const updateUserSwaggerSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', example: 'user@example.com' },
    phone: { type: 'string', example: '+8801234567890' },
    employeeID: { type: 'integer', example: 1001 },
    role: {
      type: 'string',
      enum: [UserEnum.ADMIN, UserEnum.EMPLOYEE, UserEnum.MANAGER],
    },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    gender: { type: 'string', enum: [Gender.MALE, Gender.FEMALE] },
    jobTitle: { type: 'string', enum: Object.values(JopTitle) },
    department: { type: 'string', enum: Object.values(Department) },
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
