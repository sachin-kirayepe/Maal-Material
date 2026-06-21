import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * PlatformTrustBoundaryEngine — "The Sandbox" (Phase 15)
 *
 * The ultimate security mechanism. Intercepts commands issued by third-party
 * plugins and ensures they do not violate their granted permissions or the
 * core Phase 11 constitutional logic.
 */
@Injectable()
export class PlatformTrustBoundaryEngine {
  private readonly logger = new Logger(PlatformTrustBoundaryEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Establishes a hard boundary for a specific plugin installation.
   */
  async establishBoundary(
    tenantId: string,
    pluginId: string,
    allowedTables: string[],
    allowedActions: string[],
  ) {
    this.logger.log(
      `Establishing Platform Trust Boundary for Plugin [${pluginId}] in Tenant [${tenantId}]`,
    );

    const boundary = await this.prisma.platformTrustBoundary.create({
      data: {
        tenantId,
        pluginId,
        allowedTables: JSON.stringify(allowedTables),
        allowedActions: JSON.stringify(allowedActions),
        isEnforced: true,
      },
    });

    return boundary;
  }

  /**
   * Evaluates if a runtime action by a plugin is legal.
   */
  async enforceBoundary(
    tenantId: string,
    pluginId: string,
    targetTable: string,
    targetAction: string,
  ) {
    const boundary = await this.prisma.platformTrustBoundary.findUnique({
      where: {
        tenantId_pluginId: { tenantId, pluginId },
      },
    });

    if (!boundary || !boundary.isEnforced) {
      this.logger.error(
        `CRITICAL SECURITY FAULT: No Trust Boundary exists for Plugin [${pluginId}]. Action Blocked.`,
      );
      throw new Error("TRUST_BOUNDARY_VIOLATION");
    }

    const tables: string[] = JSON.parse(boundary.allowedTables);
    const actions: string[] = JSON.parse(boundary.allowedActions);

    if (!tables.includes(targetTable) || !actions.includes(targetAction)) {
      this.logger.error(
        `CRITICAL SECURITY FAULT: Plugin [${pluginId}] attempted illegal action [${targetAction}] on [${targetTable}].`,
      );
      throw new Error("TRUST_BOUNDARY_VIOLATION");
    }

    this.logger.debug(`Trust Boundary validated for Plugin [${pluginId}].`);
    return true;
  }
}
