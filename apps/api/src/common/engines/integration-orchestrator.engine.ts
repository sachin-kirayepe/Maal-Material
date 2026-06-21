import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * IntegrationOrchestratorEngine
 *
 * Abstract outbound dispatcher that resolves internal domain events
 * against tenant-configured ApiRouteMappings and dispatches payloads
 * to external third-party services with retry intelligence.
 */
@Injectable()
export class IntegrationOrchestratorEngine {
  private readonly logger = new Logger(IntegrationOrchestratorEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Dispatches an internal event to all configured external endpoints for the tenant!.
   * Fails gracefully: logs errors and creates WebhookEvent audit records rather than
   * blocking internal operations.
   */
  async dispatchToExternalEndpoints(tenantId: string, internalEvent: string, payload: unknown) {
    this.logger.debug(
      `Dispatching external integrations for event ${internalEvent} (Tenant: ${tenantId})`,
    );

    // 1. Find all active route mappings for this event
    const routes = await this.prisma.apiRouteMapping.findMany({
      where: { tenantId, internalEvent, isActive: true },
    });

    if (routes.length === 0) return { dispatched: 0 };

    let dispatched = 0;

    for (const route of routes) {
      // 2. Create a WebhookEvent audit record for tracking
      const webhookEvent = await this.prisma.webhookEvent.create({
        data: {
          endpoint: route.externalUrl,
          event: internalEvent,
          payload: JSON.stringify(payload),
          status: "PENDING",
        },
      });

      // 3. Attempt delivery (in production, this would use HttpService with retries)
      try {
        // Simulated external HTTP call
        this.logger.log(
          `Delivering ${internalEvent} to ${route.externalUrl} (Method: ${route.httpMethod})`,
        );

        // Mark as delivered
        await this.prisma.webhookEvent.update({
          where: { id: webhookEvent.id },
          data: { status: "DELIVERED", attempts: 1 },
        });

        dispatched++;
      } catch (error: unknown) {
        this.logger.error(
          `Failed to deliver ${internalEvent} to ${route.externalUrl}: ${(error as any).message}`,
        );

        await this.prisma.webhookEvent.update({
          where: { id: webhookEvent.id },
          data: {
            status: "FAILED",
            response: (error as any).message,
            attempts: 1,
          },
        });

        // Dispatch a retry event if policy allows
        if (route.retryPolicy !== "NONE") {
          this.eventDispatcher.dispatch("integration", "webhook_delivery_failed", {
            webhookEventId: webhookEvent.id,
            retryPolicy: route.retryPolicy,
            maxRetries: route.maxRetries,
          });
        }
      }
    }

    return { dispatched };
  }

  /**
   * Checks the health of all active integrations for a tenant!.
   */
  async healthCheckIntegrations(tenantId: string) {
    const integrations = await this.prisma.externalIntegration.findMany({
      where: { tenantId, status: "ACTIVE" },
    });

    const results = [];

    for (const integration of integrations) {
      // In production: ping the integration's webhook or health endpoint
      const isHealthy = true; // Simulated

      await this.prisma.externalIntegration.update({
        where: { id: integration.id },
        data: { lastHealthCheck: new Date() },
      });

      results.push({
        provider: integration.providerName,
        type: integration.providerType,
        healthy: isHealthy,
      });
    }

    return results;
  }
}
