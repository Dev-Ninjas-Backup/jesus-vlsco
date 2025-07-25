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

export const EVENT_TYPES = {
  COMPANY_ANNOUNCEMENT_CREATE: 'company-announcement:create',
  SHIFT_ASSIGN: 'shift.assign',
  SHIFT_CHANGE: 'shift.change',
  SHIFT_STATUS_UPDATE: 'shift.status.update',
} as const;

export type EventPayloadMap = {
  [EVENT_TYPES.COMPANY_ANNOUNCEMENT_CREATE]: AnnouncementEvent;
  [EVENT_TYPES.SHIFT_ASSIGN]: ShiftEvent;
  [EVENT_TYPES.SHIFT_CHANGE]: ShiftEvent;
  [EVENT_TYPES.SHIFT_STATUS_UPDATE]: ShiftEvent;
};
