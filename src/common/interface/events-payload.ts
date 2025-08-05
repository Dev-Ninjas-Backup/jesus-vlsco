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
