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
  title: string;
  message: string;
  publishedAt: Date;
  recipients: string[];
  sendEmail: boolean;
  sendWs: boolean;
}

export const EVENT_TYPES = {
  COMPANY_ANNOUNCEMENT_CREATE: 'company-announcement:create',
  SHIFT_CREATE: 'shift:create',
} as const;

export type EventPayloadMap = {
  [EVENT_TYPES.COMPANY_ANNOUNCEMENT_CREATE]: AnnouncementEvent;
  [EVENT_TYPES.SHIFT_CREATE]: ShiftEvent;
};
