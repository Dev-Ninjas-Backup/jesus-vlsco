export interface AnnouncementEvent {
  announcementId: string;
  title: string;
  message: string;
  publishedAt: Date;
  recipients: string[];
  sendEmail: boolean;
  sendWs: boolean;
}

export const EVENT_TYPES = {
  COMPANY_ANNOUNCEMENT_CREATE: 'company-announcement:create',
} as const;

export type EventPayloadMap = {
  [EVENT_TYPES.COMPANY_ANNOUNCEMENT_CREATE]: AnnouncementEvent;
};
