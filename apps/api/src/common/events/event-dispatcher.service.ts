import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { tenantContext } from "../context/tenant.context";
import { correlationContext } from "../context/correlation.context";
import { randomUUID } from "crypto";

export interface EnterpriseDomainEvent<T = any> {
  eventId: string;
  correlationId: string;
  tenantId: string | null;
  timestamp: string;
  domain: string;
  action: string;
  payload: T;
}

@Injectable()
export class EventDispatcherService {
  private readonly logger = new Logger(EventDispatcherService.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * Safely dispatches a domain event wrapped in an Enterprise envelope,
   * automatically injecting active Tenant ID and Correlation ID.
   */
  dispatch<T>(domain: string, action: string, payload: T): boolean {
    const tCtx = tenantContext.getStore();
    const cCtx = correlationContext.getStore();

    const event: EnterpriseDomainEvent<T> = {
      eventId: randomUUID(),
      correlationId: cCtx?.correlationId || randomUUID(),
      tenantId: tCtx?.tenantId || null,
      timestamp: new Date().toISOString(),
      domain,
      action,
      payload,
    };

    const eventName = `${domain}.${action}`;
    this.logger.debug(`Dispatching domain event: ${eventName} (EventID: ${event.eventId})`);

    return this.eventEmitter.emit(eventName, event);
  }
}
