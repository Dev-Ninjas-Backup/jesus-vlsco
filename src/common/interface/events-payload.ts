export interface Notification {
  type: string;
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

export interface AnnouncementEvent {
  announcementId: string;
  title: string;
  message: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  meta: {
    performedBy?: string; // admin or user who created the announcement
    publishedAt: Date;
    recipients: { email: string, id: string }[];
    sendEmail: boolean;
  }
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
