import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PrismaService } from "@database/prisma.service";

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Publish a domain event.
   * This is a fire-and-forget method that:
   * 1. Broadcasts the event locally via EventEmitter
   * 2. Persists the event in the SystemEvent table for audit & event sourcing
   */
  async publish(eventName: string, payload: unknown, eventId?: string) {
    this.logger.debug(`Publishing event: ${eventName}`);

    // Emit internally for decouple modules
    this.eventEmitter.emit(eventName, payload);

    // Persist to Database asynchronously
    try {
      await this.prisma.systemEvent.create({
        data: {
          eventId: eventId || crypto.randomUUID(),
          eventName,
          payload: JSON.stringify(payload),
          status: "PROCESSED",
          processedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(`Failed to record system event: ${eventName}`, (error as Error).message);
    }
  }
}
