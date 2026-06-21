import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * SdkOrchestratorEngine
 *
 * Provides a versioned, secure bridge for extensions to hook into internal platform
 * events. If a plugin wants to trigger custom logic when a UniversalOrder is placed,
 * it subscribes via this engine.
 */
@Injectable()
export class SdkOrchestratorEngine {
  private readonly logger = new Logger(SdkOrchestratorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Broadcasts an internal platform event to safely registered 3rd party plugins.
   */
  async dispatchSdkEvent(tenantId: string, eventTopic: string, payloadJson: unknown) {
    this.logger.debug(`Dispatching SDK Event [${eventTopic}] for Tenant [${tenantId}]`);

    // Only active plugins for this tenant
    const activePlugins = await this.prisma.industrialAppPlugin.findMany({
      where: { tenantId, status: "ACTIVE" },
    });

    if (activePlugins.length === 0) {
      return; // No plugins listening
    }

    // In a real environment, this would push messages to a sandboxed broker
    // (e.g. Kafka or AWS EventBridge) where the 3rd party plugin code listens.
    // The core platform DOES NOT execute the 3rd party code directly in the main thread.
    this.logger.log(
      `Forwarding event ${eventTopic} to ${activePlugins.length} sandboxed plugin webhooks.`,
    );

    // Simulate async dispatch
    for (const plugin of activePlugins) {
      this.logger.debug(`-> Forwarding to Plugin: ${plugin.pluginKey}`);
    }
  }
}
