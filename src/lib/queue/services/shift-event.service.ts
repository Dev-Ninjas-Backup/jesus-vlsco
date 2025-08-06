import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EVENT_TYPES,
  EventPayloadMap,
} from '@project/common/interface/events-name';
import { QueueName } from '@project/common/interface/queue-name';
import { NotificationGateway } from '@project/lib/notification/notification.gateway';
import { Queue } from 'bullmq';

@Injectable()
export class ShiftEventService {
  constructor(
    @InjectQueue(QueueName.SHIFT) private readonly notificationQueue: Queue,
    private readonly gateway: NotificationGateway,
  ) {}

  /**
   * Handles shift assignment events.
   */
  @OnEvent(EVENT_TYPES.SHIFT_ASSIGN)
  async handleShiftAssignment(
    payload: EventPayloadMap[typeof EVENT_TYPES.SHIFT_ASSIGN],
  ) {
    // Enqueue for processing by worker
    await this.notificationQueue.add(EVENT_TYPES.SHIFT_ASSIGN, payload);
  }
}
