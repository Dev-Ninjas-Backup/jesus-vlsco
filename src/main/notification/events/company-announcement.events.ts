import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bullmq';
import { EVENT_TYPES, EventPayloadMap } from '../interface/events';

@Injectable()
export class CompanyAnnouncementEvents {
  constructor(
    @InjectQueue('notification') private readonly notificationQueue: Queue,
  ) {}

  @OnEvent(EVENT_TYPES.COMPANY_ANNOUNCEMENT_CREATE)
  async handleCreateAnnouncement(
    payload: EventPayloadMap[typeof EVENT_TYPES.COMPANY_ANNOUNCEMENT_CREATE],
  ) {
    await this.notificationQueue.add('company-announcement:create', payload);
  }

  @OnEvent(EVENT_TYPES.COMPANY_ANNOUNCEMENT_BROADCAST)
  async handleBroadcastAnnouncement(
    payload: EventPayloadMap[typeof EVENT_TYPES.COMPANY_ANNOUNCEMENT_BROADCAST],
  ) {
    await this.notificationQueue.add('company-announcement:broadcast', payload);
  }
}
