import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { CapabilityOrchestratorEngine } from "./capability-orchestrator.engine";

/**
 * UniversalParticipantEngine
 *
 * Handles multi-role participant logic across the commerce ecosystem.
 * Abstracts Suppliers, Vendors, Contractors, Service Providers into
 * a unified "Commerce Participant" concept with dynamic role capabilities.
 *
 * A single business entity can simultaneously be a Supplier, a Rental Provider,
 * and a Workforce Contractor without needing separate registrations.
 */
@Injectable()
export class UniversalParticipantEngine {
  private readonly logger = new Logger(UniversalParticipantEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly capabilityEngine: CapabilityOrchestratorEngine,
  ) {}

  /**
   * Resolves a participant by ID and returns their active roles/capabilities.
   * In the future this will aggregate data from CommerceParticipant + EnterpriseVendor + EcosystemWorkforce
   * into a single unified participant profile.
   */
  async resolveParticipant(participantId: string, tenantId: string) {
    this.logger.debug(`Resolving participant ${participantId} for tenant ${tenantId}`);

    const participant = await this.prisma.commerceParticipant.findFirst({
      where: { id: participantId, deletedAt: null },
      include: {
        supplierLedgers: true,
        _count: { select: { purchaseOrders: true, purchaseInvoices: true } },
      },
    });

    if (!participant) {
      return null;
    }

    // Derive participant roles from their data profile
    const roles: string[] = ["SUPPLIER"]; // Base role

    if (participant.supplierType === "CONTRACTOR") {
      roles.push("CONTRACTOR");
    }
    if (participant.supplierType === "MANUFACTURER") {
      roles.push("MANUFACTURER");
    }

    return {
      ...participant,
      derivedRoles: roles,
      isMultiRole: roles.length > 1,
    };
  }

  /**
   * Query all active participants for a tenant, optionally filtered by role.
   */
  async findParticipants(tenantId: string, roleFilter?: string) {
    const where: unknown = { deletedAt: null, isActive: true };

    if (roleFilter) {
      (where as any).supplierType = roleFilter;
    }

    return this.prisma.commerceParticipant.findMany({
      where: where as any,
      orderBy: { rating: "desc" },
    });
  }
}
