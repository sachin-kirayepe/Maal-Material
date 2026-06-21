import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * RegionalClusterEngine — "The Cluster Orchestrator" (Phase 3D)
 *
 * Manages geographical and industrial boundaries to form Regional Ecosystem Clusters.
 * Allows independent tenants to group together to share resources, unify supply chains,
 * and present a combined operational front without merging their distinct legal entities.
 */
@Injectable()
export class RegionalClusterEngine {
  private readonly logger = new Logger(RegionalClusterEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes a new regional ecosystem cluster.
   */
  async createCluster(
    clusterName: string,
    regionCode: string,
    industryDomain: string,
    initialTenants: string[],
  ) {
    this.logger.log(
      `Forming new Regional Cluster: [${clusterName}] in [${regionCode}] for [${industryDomain}]`,
    );

    return this.prisma.regionalEcosystemCluster.create({
      data: {
        clusterName,
        regionCode,
        industryDomain,
        memberTenantsJson: JSON.stringify(initialTenants),
        clusterStatus: "FORMING",
      },
    });
  }

  /**
   * Adds a new tenant to an existing cluster.
   */
  async joinCluster(clusterId: string, newTenantId: string) {
    const cluster = await this.prisma.regionalEcosystemCluster.findUnique({
      where: { id: clusterId },
    });

    if (!cluster) {
      throw new Error(`Cluster ${clusterId} not found.`);
    }

    const members: string[] = JSON.parse(cluster.memberTenantsJson);
    if (members.includes(newTenantId)) {
      this.logger.debug(`Tenant ${newTenantId} is already in cluster ${clusterId}.`);
      return cluster;
    }

    members.push(newTenantId);
    this.logger.log(`Tenant ${newTenantId} joining cluster [${cluster.clusterName}]`);

    return this.prisma.regionalEcosystemCluster.update({
      where: { id: clusterId },
      data: { memberTenantsJson: JSON.stringify(members) },
    });
  }

  /**
   * Marks a cluster as active once sufficient membership and governance is established.
   */
  async activateCluster(clusterId: string) {
    this.logger.log(`Activating cluster [${clusterId}]`);
    return this.prisma.regionalEcosystemCluster.update({
      where: { id: clusterId },
      data: { clusterStatus: "ACTIVE" },
    });
  }

  /**
   * Finds all clusters operating in a specific region and domain.
   */
  async getClustersByRegion(regionCode: string, industryDomain?: string) {
    return this.prisma.regionalEcosystemCluster.findMany({
      where: {
        regionCode,
        ...(industryDomain ? { industryDomain } : {}),
      },
    });
  }
}
