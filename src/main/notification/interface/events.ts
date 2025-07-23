

export interface AnnouncementEvent {
  title: string;
  message: string;
  publishedAt: Date;
}

export const EVENT_TYPES = {
  COMPANY_ANNOUNCEMENT_CREATE: 'ANNOUNCEMENT_CREATE',
  COMPANY_ANNOUNCEMENT_BROADCAST: 'ANNOUNCEMENT_BROADCAST',
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export interface EventPayloadMap {
  [EVENT_TYPES.COMPANY_ANNOUNCEMENT_CREATE]: AnnouncementEvent | any;
  [EVENT_TYPES.COMPANY_ANNOUNCEMENT_BROADCAST]: AnnouncementEvent;
}
