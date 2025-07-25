export interface AnnouncementEvent {
  announcementId: string;
  title: string;
  message: string;
  publishedAt: Date;
  recipients: string[];
  sendEmail: boolean;
  sendWs: boolean;
}

export interface ShiftEvent {
  shiftId: string;
  userId: string;
  action?: 'ASSIGN' | 'CHANGE' | 'STATUS_UPDATE';
  meta?: {
    performedBy?: string; // admin or manager who triggered it
    status?: 'APPROVED' | 'REJECTED' | 'PENDING';
    date?: string; // ISO string
  };
}

export interface TimeOffEvent {
  requestId: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE';
  meta?: {
    performedBy?: string; // admin or user
    status?: 'APPROVED' | 'REJECTED' | 'PENDING'; // only for status change
    reason?: string; // optional reason for rejection
    startDate?: string; // ISO format
    endDate?: string; // ISO format
  };
}

export const EVENT_TYPES = {
  COMPANY_ANNOUNCEMENT_CREATE: 'company-announcement.create',
  SHIFT_ASSIGN: 'shift.assign',
  SHIFT_CHANGE: 'shift.change',
  SHIFT_STATUS_UPDATE: 'shift.status.update',

  TIME_OFF_CREATE: 'timeoff.create',
  TIME_OFF_UPDATE: 'timeoff.update',
  TIME_OFF_DELETE: 'timeoff.delete',
  TIME_OFF_STATUS_CHANGE: 'timeoff.status.change',
} as const;

export type EventPayloadMap = {
  [EVENT_TYPES.COMPANY_ANNOUNCEMENT_CREATE]: AnnouncementEvent;
  [EVENT_TYPES.SHIFT_ASSIGN]: ShiftEvent;
  [EVENT_TYPES.SHIFT_CHANGE]: ShiftEvent;
  [EVENT_TYPES.SHIFT_STATUS_UPDATE]: ShiftEvent;

  [EVENT_TYPES.TIME_OFF_CREATE]: TimeOffEvent;
  [EVENT_TYPES.TIME_OFF_UPDATE]: TimeOffEvent;
  [EVENT_TYPES.TIME_OFF_DELETE]: TimeOffEvent;
  [EVENT_TYPES.TIME_OFF_STATUS_CHANGE]: TimeOffEvent;
};
