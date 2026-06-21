import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * ValueFlowEngine — "The Capital Mapper" (Phase 3Y)
 *
 * Tracks and optimizes ValueFlowEdge networks to ensure capital fluidity,
 * settlement speed, and zero financial bottlenecks across the ecosystem.
 */
@Injectable()
export class ValueFlowEngine {
  private readonly logger = new Logger(ValueFlowEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a movement of commercial value through the grid.
   */
  async recordValueFlow(
    tenantId: string,
    origin: string,
    destination: string,
    assetType: string,
    velocity: number,
  ) {
    this.logger.debug(
      `Recording Value Flow [${origin} -> ${destination}] [Type: ${assetType}] [Velocity: ${velocity}]`,
    );

    return this.prisma.valueFlowEdge.create({
      data: {
        tenantId,
        originNodeId: origin,
        destinationNodeId: destination,
        assetType,
        flowVelocity: velocity,
      },
    });
  }

  /**
   * Evaluates the speed and friction of capital moving between two entities.
   */
  async evaluateFlowFriction(tenantId: string, origin: string, destination: string) {
    this.logger.log(`Evaluating Value-Flow Friction [${origin} -> ${destination}]`);

    const flows = await this.prisma.valueFlowEdge.findMany({
      where: { tenantId, originNodeId: origin, destinationNodeId: destination },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    if (flows.length === 0) return { status: "NO_DATA", friction: 1.0 };

    // Example logic: The slower the velocity, the higher the commercial friction
    const avgVelocity = flows.reduce((sum, f) => sum + f.flowVelocity, 0) / flows.length;

    return {
      status: avgVelocity > 50 ? "HIGH_FLUIDITY" : "CONGESTED",
      friction: avgVelocity > 50 ? 0.1 : 0.8,
    };
  }
}
