import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * DynamicBalancingEngine — "The Load Balancer" (Phase 3F)
 *
 * Constantly evaluates ecosystem resource loads (e.g., Warehouse capacity, Logistics fleets).
 * If a node exceeds target load percentage, the balancer flags the region for autonomous re-routing.
 */
@Injectable()
export class DynamicBalancingEngine {
  private readonly logger = new Logger(DynamicBalancingEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers or updates a dynamic resource balancer.
   */
  async updateBalancer(
    tenantId: string,
    resourceDomain: string,
    regionCode: string,
    currentLoadPct: number,
    targetLoadPct: number,
    triggers: unknown,
  ) {
    this.logger.debug(
      `Updating Resource Balancer [${resourceDomain}] in [${regionCode}] - Load: ${(currentLoadPct * 100).toFixed(1)}%`,
    );

    // Upsert equivalent functionality
    const existing = await this.prisma.dynamicResourceBalancer.findFirst({
      where: { tenantId, resourceDomain, regionCode },
    });

    if (existing) {
      return this.prisma.dynamicResourceBalancer.update({
        where: { id: existing!.id },
        data: {
          currentLoadPct,
          targetLoadPct,
          rebalanceTriggers: JSON.stringify(triggers),
          lastBalancedAt: new Date(),
        },
      });
    }

    return this.prisma.dynamicResourceBalancer.create({
      data: {
        tenantId,
        resourceDomain,
        regionCode,
        currentLoadPct,
        targetLoadPct,
        rebalanceTriggers: JSON.stringify(triggers),
      },
    });
  }

  /**
   * Identifies resources that are currently over-utilized and require rebalancing.
   */
  async identifyOverloadedResources(tenantId: string) {
    const balancers = await this.prisma.dynamicResourceBalancer.findMany({
      where: { tenantId },
    });

    const overloaded = balancers.filter((b) => b.currentLoadPct > b.targetLoadPct);

    if (overloaded.length > 0) {
      this.logger.warn(
        `Identified ${overloaded.length} overloaded resources for Tenant [${tenantId}] requiring autonomous rebalancing.`,
      );
    }

    return overloaded;
  }
}
