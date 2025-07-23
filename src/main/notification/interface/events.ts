export interface AnnouncementEvent {
  title: string;
  message: string;
  publishedAt: Date;
}

export const EVENT_TYPES = {
  COMPANY_ANNOUNCEMENT_CREATE: 'company-announcement:create',
  COMPANY_ANNOUNCEMENT_BROADCAST: 'company-announcement:broadcast',
} as const;

export type EventPayloadMap = {
  [EVENT_TYPES.COMPANY_ANNOUNCEMENT_CREATE]: AnnouncementEvent;
  [EVENT_TYPES.COMPANY_ANNOUNCEMENT_BROADCAST]: AnnouncementEvent;
};
