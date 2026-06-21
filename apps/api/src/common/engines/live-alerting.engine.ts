import { Injectable, Logger } from "@nestjs/common";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * LiveAlertingEngine — "The Tactical Dispatcher" (Phase 3A)
 *
 * Listens to Digital Twin critical state events and Operational Consciousness
 * insights, dispatching real-time notifications to the appropriate ecosystem
 * participants or external systems.
 */
@Injectable()
export class LiveAlertingEngine {
  private readonly logger = new Logger(LiveAlertingEngine.name);

  constructor(private readonly eventDispatcher: EventDispatcherService) {}

  /**
   * Broadcasts a critical tactical alert to relevant personnel.
   */
  async broadcastTacticalAlert(
    tenantId: string,
    assetNodeId: string,
    alertType: string,
    severity: string,
    message: string,
  ) {
    this.logger.warn(
      `TACTICAL ALERT DISPATCHED [${severity}] for Asset [${assetNodeId}]: ${message}`,
    );

    // In a real system, this routes to SMS, Push, Slack, or Webhooks.
    this.eventDispatcher.dispatch("alerts", "tactical_alert_sent", {
      tenantId,
      assetNodeId,
      alertType,
      severity,
      message,
      dispatchedAt: new Date(),
    });

    return { status: "DISPATCHED" };
  }
}
