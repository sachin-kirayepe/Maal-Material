import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CapabilityOrchestratorEngine } from "./capability-orchestrator.engine";
import { UniversalParticipantEngine } from "./universal-participant.engine";

export interface DashboardContext {
  userId: string;
  tenantId: string;
  participantId?: string;
}

/**
 * AdaptiveExperienceEngine
 *
 * Orchestrates dynamic UI composition based on user context, roles, and tenant capabilities.
 * Replaces static frontend routing with intelligent backend-driven dashboards.
 */
@Injectable()
export class AdaptiveExperienceEngine {
  private readonly logger = new Logger(AdaptiveExperienceEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly capabilityEngine: CapabilityOrchestratorEngine,
    private readonly participantEngine: UniversalParticipantEngine,
  ) {}

  /**
   * Resolves the complete dashboard layout and permissible widgets for a user!.
   */
  async resolveDashboard(context: DashboardContext) {
    this.logger.debug(`Resolving adaptive dashboard for tenant ${context.tenantId}`);

    // 1. Determine User's Primary Role
    let roleTarget = "DEFAULT";
    if (context.participantId) {
      const participant = await this.participantEngine.resolveParticipant(
        context.participantId,
        context.tenantId,
      );
      if (participant && participant.derivedRoles.length > 0) {
        // Use primary role for dashboard resolution
        roleTarget = participant.derivedRoles![0] as string;
      }
    }

    // 2. Fetch appropriate dashboard layout
    // Fallback to system default if tenant specific dashboard doesn't exist
    let dashboard = await this.prisma.experienceDashboard.findFirst({
      where: {
        tenantId: context.tenantId,
        roleTarget,
        isActive: true,
      },
      include: {
        placements: {
          orderBy: { sortOrder: "asc" },
          include: {
            widget: {
              include: { requiredCaps: true },
            },
          },
        },
      },
    });

    if (!dashboard) {
      this.logger.log(
        `No specific dashboard found for tenant ${context.tenantId}, role ${roleTarget}. Falling back to default.`,
      );
      dashboard = await this.prisma.experienceDashboard.findFirst({
        where: {
          tenantId: null, // System default
          roleTarget,
          isDefault: true,
          isActive: true,
        },
        include: {
          placements: {
            orderBy: { sortOrder: "asc" },
            include: {
              widget: {
                include: { requiredCaps: true },
              },
            },
          },
        },
      });
    }

    if (!dashboard) {
      // Ultimate fallback
      return {
        id: "system-fallback",
        name: "Default Experience",
        layoutType: "GRID",
        widgets: [],
      };
    }

    // 3. Filter widgets by tenant capabilities
    const tenantCapabilities = await this.prisma.tenantCapability.findMany({
      where: { tenantId: context.tenantId, isEnabled: true } as any,
    });
    const activeCaps = new Set(tenantCapabilities.map((c) => c.capabilityName));

    const permittedPlacements = dashboard.placements.filter((placement) => {
      // If widget has no capability requirements, it's universally permitted
      if (placement.widget.requiredCaps.length === 0) return true;

      // Check if tenant has ALL required capabilities for this widget
      return placement.widget.requiredCaps.every((req) => activeCaps.has(req.capabilityName));
    });

    // 4. Construct JSON payload for frontend rendering
    return {
      id: dashboard.id,
      name: dashboard.name,
      layoutType: dashboard.layoutType,
      roleTarget: dashboard.roleTarget,
      widgets: permittedPlacements.map((p) => ({
        placementId: p.id,
        widgetCode: p.widget.widgetCode,
        componentName: p.widget.componentName,
        zone: p.zone,
        width: p.width || p.widget.defaultWidth,
        height: p.height || p.widget.defaultHeight,
        config: p.configJson ? JSON.parse(p.configJson) : null,
      })),
    };
  }

  /**
   * Helper to seed default system dashboards.
   * In a real system, this would be part of a robust migration/seeding script.
   */
  async seedSystemDefaults() {
    this.logger.log("Seeding default adaptive experiences...");
    // Seed logic goes here
  }
}
