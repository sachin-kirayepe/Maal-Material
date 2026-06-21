import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * MobileExecutionOrchestrationEngine — "The Edge Dispatcher" (Phase 12)
 *
 * Provides the backend logic for streaming real-time instructions, routing, and workflows
 * directly to a contractor's mobile device or tablet in the field.
 */
@Injectable()
export class MobileExecutionOrchestrationEngine {
  private readonly logger = new Logger(MobileExecutionOrchestrationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tracks a live ping from a mobile execution session.
   */
  async pingMobileSession(tenantId: string, sessionId: string, gpsString: string) {
    this.logger.debug(`Ping received from Mobile Session [${sessionId}] at GPS [${gpsString}]`);

    return this.prisma.mobileExecutionSession.update({
      where: { id: sessionId },
      data: {
        currentGps: gpsString,
        lastPingAt: new Date(),
      },
    });
  }

  /**
   * Pushes a new workflow directly to an active mobile session.
   */
  async pushWorkflowToEdge(sessionId: string, workflows: unknown) {
    this.logger.log(`Pushing new workflow to Edge Device Session [${sessionId}]`);

    return this.prisma.mobileExecutionSession.update({
      where: { id: sessionId },
      data: {
        activeWorkflows: JSON.stringify(workflows),
        status: "ENGAGED",
      },
    });
  }
}
