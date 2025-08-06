export interface Notification {
  type: string;
  title: string;
  message: string;
  createdAt: Date;
  meta: Record<string, any>;
}

export interface AnnouncementEvent {
  title: string;
  message: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  meta: {
    announcementId: string;
    performedBy: string;
    publishedAt: Date;
    recipients: { email: string; id: string }[];
    sendEmail: boolean;
  };
}

export interface ShiftEvent {
  action: 'ASSIGN' | 'CHANGE' | 'STATUS_UPDATE';
  meta: {
    userId: string;
    shiftId: string;
    performedBy: string; // admin or manager who triggered it
    status: 'APPROVED' | 'REJECTED' | 'PENDING';
    date: string; // ISO string
  };
}

export interface TimeOffEvent {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE';
  meta: {
    userId: string;
    requestId: string;
    performedBy?: string; // admin or user
    status?: 'APPROVED' | 'REJECTED' | 'PENDING'; // only for status change
    reason?: string; // optional reason for rejection
    startDate?: string; // ISO format
    endDate?: string; // ISO format
  };
}
