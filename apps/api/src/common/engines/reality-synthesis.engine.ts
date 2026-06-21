import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * RealitySynthesisEngine — "The Universal Twin Architect" (Phase 3Q)
 *
 * Fuses complex telemetry, supply chain data, and autonomous workflow states
 * into a single, high-fidelity Universal Digital Civilization Twin.
 */
@Injectable()
export class RealitySynthesisEngine {
  private readonly logger = new Logger(RealitySynthesisEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Synthesizes and updates the macro-state of an ecosystem sector.
   */
  async synthesizeEcosystemReality(tenantId: string, ecosystemSector: string, stateGraph: unknown) {
    this.logger.log(`Synthesizing Reality for Sector: [${ecosystemSector}]`);

    const existingTwin = await this.prisma.universalDigitalTwin.findFirst({
      where: { tenantId, ecosystemSector },
    });

    if (existingTwin) {
      return this.prisma.universalDigitalTwin.update({
        where: { id: existingTwin.id },
        data: {
          stateGraphJson: JSON.stringify(stateGraph),
        },
      });
    } else {
      return this.prisma.universalDigitalTwin.create({
        data: {
          tenantId,
          ecosystemSector,
          resolutionLevel: "MACRO",
          stateGraphJson: JSON.stringify(stateGraph),
        },
      });
    }
  }

  /**
   * Captures a point-in-time snapshot of the synthesized reality.
   */
  async captureStateSnapshot(tenantId: string, twinId: string, snapshotType: string) {
    this.logger.debug(`Capturing State Snapshot [${snapshotType}] for Twin: ${twinId}`);

    const twin = await this.prisma.universalDigitalTwin.findUnique({ where: { id: twinId } });
    if (!twin) throw new Error("Twin not found");

    return this.prisma.ecosystemStateSnapshot.create({
      data: {
        tenantId,
        twinId,
        snapshotType,
        synthesizedDataJson: twin.stateGraphJson,
      },
    });
  }
}
