import { Labels, TaskStatus } from '@prisma/client';

export const addTaskSwaggerSchema = {
  type: 'object',
  properties: {
    projectId: {
      type: 'string',
      format: 'uuid',
      example: '123e4567-e89b-12d3-a456-426655440000',
    },
    assignUserId: {
      type: 'string',
      format: 'uuid',
      example: '123e4567-e89b-12d3-a456-426655440000',
    },
    title: { type: 'string', example: 'Design Homepage' },
    description: {
      type: 'string',
      example: 'Design the main landing page UI',
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
      type: 'string',
      enum: Object.values(Labels),
      example: Labels.LOW,
      description: 'Task priority label',
    },
    status: {
      type: 'string',
      enum: Object.values(TaskStatus),
      example: TaskStatus.OPEN,
      description: 'Task status',
    },
  },
};

export const updateTaskSwaggerSchema = {
  type: 'object',
  properties: {
    projectId: {
      type: 'string',
      format: 'uuid',
      example: '123e4567-e89b-12d3-a456-426655440000',
    },
    assignUserId: {
      type: 'string',
      format: 'uuid',
      example: '123e4567-e89b-12d3-a456-426655440000',
    },
    title: { type: 'string', example: 'Design Homepage v2' },
    description: {
      type: 'string',
      example: 'Revised UI for landing page',
    },
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
      type: 'string',
      enum: Object.values(Labels),
      example: Labels.LOW,
      description: 'Task priority label',
    },
    status: {
      type: 'string',
      enum: Object.values(TaskStatus),
      example: TaskStatus.DONE,
      description: 'Task status',
    },
    attachment: { type: 'string', format: 'binary' },
  },
};
