import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * OrganizationalDigitalTwinEngine — "The Mirror" (Phase 26)
 *
 * Maintains the real-time simulation of the enterprise structure, allowing
 * the AI to simulate structural changes before applying them.
 */
@Injectable()
export class OrganizationalDigitalTwinEngine {
  private readonly logger = new Logger(OrganizationalDigitalTwinEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Syncs the latest enterprise structural state into the digital twin simulation.
   */
  async syncEnterpriseStructure(tenantId: string, graphState: unknown) {
    this.logger.debug(`Syncing Organizational Digital Twin for Tenant [${tenantId}]`);

    const twin = await this.prisma.organizationalDigitalTwin.create({
      data: {
        tenantId,
        structuralGraph: JSON.stringify(graphState),
        simulationState: "ACTIVE",
      },
    });

    return twin;
  }
}
