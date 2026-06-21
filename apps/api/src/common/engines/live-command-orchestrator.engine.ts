import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * LiveCommandOrchestratorEngine
 *
 * Provides safe, bi-directional control from the digital twin dashboard
 * down to the physical industrial assets. Tracks command execution state.
 */
@Injectable()
export class LiveCommandOrchestratorEngine {
  private readonly logger = new Logger(LiveCommandOrchestratorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Dispatches a command from the Command Center to a physical twin.
   */
  async dispatchCommand(
    tenantId: string,
    targetEntityId: string,
    targetEntityType: string,
    commandType: string,
    payload: unknown,
  ) {
    this.logger.log(
      `Dispatching [${commandType}] to ${targetEntityType} ${targetEntityId} for Tenant ${tenantId}`,
    );

    // In a real environment, this sends an MQTT/IoT to the physical edge device.
    return this.prisma.liveOperationalCommand.create({
      data: {
        tenantId,
        targetEntityId,
        targetEntityType,
        commandType,
        payloadJson: JSON.stringify(payload),
        status: "DISPATCHED",
      },
    });
  }

  /**
   * Called via IoT webhook when a physical asset acknowledges/completes a command.
   */
  async resolveCommand(commandId: string, success: boolean) {
    this.logger.debug(`Resolving Command [${commandId}] - Success: ${success}`);

    return this.prisma.liveOperationalCommand.update({
      where: { id: commandId },
      data: {
        status: success ? "EXECUTED" : "FAILED",
        resolvedAt: new Date(),
      },
    });
  }
}
