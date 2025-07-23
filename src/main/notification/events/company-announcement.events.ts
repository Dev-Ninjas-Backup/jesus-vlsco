import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { AnnouncementEvent, EVENT_TYPES } from '../interface/events';

@Injectable()
export class CompanyAnnouncementEvents {
  constructor(
    @InjectQueue('notification') private readonly notificationQueue: Queue,
  ) {}

  @OnEvent(EVENT_TYPES.COMPANY_ANNOUNCEMENT_CREATE)
  async handleCreateAnnouncement(payload: AnnouncementEvent) {
    // send emails based on payload

    // then enqueue broadcast
    await this.notificationQueue.add(
      EVENT_TYPES.COMPANY_ANNOUNCEMENT_BROADCAST,
      payload,
    );
  }

  @OnEvent(EVENT_TYPES.COMPANY_ANNOUNCEMENT_BROADCAST)
  async handleBroadcastAnnouncement(payload: AnnouncementEvent) {
    // send emails based on payload

    // then enqueue broadcast
    await this.notificationQueue.add(
      EVENT_TYPES.COMPANY_ANNOUNCEMENT_BROADCAST,
      payload,
    );
  }
}
