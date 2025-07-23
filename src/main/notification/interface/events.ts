export interface NotificationEvent {
  userId: string;
  title: string;
  message: string;
  data?: Record<string, any>;
}

export interface AnnouncementEvent {
  title: string;
  message: string;
  publishedAt: Date;
}

export const EVENT_TYPES = {
  NOTIFICATION_SEND: 'NOTIFICATION_SEND',
  BULK_NOTIFICATION_SEND: 'BULK_NOTIFICATION_SEND',
  COMPANY_ANNOUNCEMENT_CREATE: 'ANNOUNCEMENT_CREATE',
  COMPANY_ANNOUNCEMENT_BROADCAST: 'ANNOUNCEMENT_BROADCAST',
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export interface EventPayloadMap {
  [EVENT_TYPES.NOTIFICATION_SEND]: NotificationEvent;
  [EVENT_TYPES.BULK_NOTIFICATION_SEND]: NotificationEvent[];

  [EVENT_TYPES.COMPANY_ANNOUNCEMENT_CREATE]: AnnouncementEvent;
  [EVENT_TYPES.COMPANY_ANNOUNCEMENT_BROADCAST]: AnnouncementEvent;
}
