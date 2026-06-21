import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * DisputeOrchestrationEngine
 *
 * Manages the lifecycle of dispute cases from creation through mediation
 * to resolution. Integrates with trust scoring to penalize repeat offenders
 * and reward good-faith resolution.
 */
@Injectable()
export class DisputeOrchestrationEngine {
  private readonly logger = new Logger(DisputeOrchestrationEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Opens a formal dispute case.
   */
  async openDispute(params: {
    tenantId: string;
    referenceId: string;
    disputeType: string;
    raisedBy: string;
    againstEntityId: string;
    description: string;
  }) {
    this.logger.log(
      `Opening dispute case: ${params.disputeType} against ${params.againstEntityId}`,
    );

    const disputeCase = await this.prisma.disputeCase.create({
      data: {
        tenantId: params.tenantId,
        referenceId: params.referenceId,
        disputeType: params.disputeType,
        raisedBy: params.raisedBy,
        againstEntityId: params.againstEntityId,
        description: params.description,
        status: "OPEN",
      },
    });

    // Record a RiskAssessment for the entity being disputed
    await this.prisma.riskAssessment.create({
      data: {
        tenantId: params.tenantId,
        entityId: params.againstEntityId,
        riskType: "OPERATIONAL_RISK",
        riskScore: 0.6,
        flagged: false,
        analysisDetails: `Dispute opened: ${params.disputeType}. Reference: ${params.referenceId}.`,
      },
    });

    this.eventDispatcher.dispatch("trust", "dispute_opened", {
      disputeId: disputeCase.id,
      disputeType: params.disputeType,
      againstEntityId: params.againstEntityId,
    });

    return disputeCase;
  }

  /**
   * Escalates a dispute to mediation if it remains unresolved.
   */
  async escalateToMediation(disputeId: string) {
    const dispute = await this.prisma.disputeCase.findUnique({ where: { id: disputeId } });
    if (!dispute || dispute.status !== "OPEN") return dispute;

    this.logger.warn(`Escalating dispute ${disputeId} to MEDIATION.`);

    const updated = await this.prisma.disputeCase.update({
      where: { id: disputeId },
      data: { status: "MEDIATION" },
    });

    // Increase risk assessment score for escalated disputes
    await this.prisma.riskAssessment.create({
      data: {
        tenantId: dispute.tenantId,
        entityId: dispute.againstEntityId,
        riskType: "OPERATIONAL_RISK",
        riskScore: 0.8,
        flagged: true,
        analysisDetails: `Dispute escalated to mediation. ID: ${disputeId}.`,
      },
    });

    this.eventDispatcher.dispatch("trust", "dispute_escalated", {
      disputeId,
      againstEntityId: dispute.againstEntityId,
    });

    return updated;
  }

  /**
   * Settles a dispute and records the resolution.
   */
  async settleDispute(disputeId: string, resolution: string) {
    this.logger.log(`Settling dispute ${disputeId}`);

    const updated = await this.prisma.disputeCase.update({
      where: { id: disputeId },
      data: { status: "SETTLED", resolution },
    });

    // Audit trail
    await this.prisma.trustAuditLog.create({
      data: {
        tenantId: updated.tenantId,
        action: "DISPUTE_SETTLED",
        entityId: updated.againstEntityId,
        performedBy: "DisputeOrchestrationEngine",
        reason: resolution,
      },
    });

    // Trigger trust re-evaluation for the entity
    this.eventDispatcher.dispatch("trust", "dispute_settled", {
      disputeId,
      againstEntityId: updated.againstEntityId,
      tenantId: updated.tenantId,
    });

    return updated;
  }

  /**
   * Returns a summary of dispute health for a specific entity.
   */
  async getEntityDisputeSummary(tenantId: string, entityId: string) {
    const [openCount, mediationCount, settledCount, totalCount] = await Promise.all([
      this.prisma.disputeCase.count({
        where: { tenantId, againstEntityId: entityId, status: "OPEN" },
      }),
      this.prisma.disputeCase.count({
        where: { tenantId, againstEntityId: entityId, status: "MEDIATION" },
      }),
      this.prisma.disputeCase.count({
        where: { tenantId, againstEntityId: entityId, status: "SETTLED" },
      }),
      this.prisma.disputeCase.count({ where: { tenantId, againstEntityId: entityId } }),
    ]);

    return {
      entityId,
      openDisputes: openCount,
      inMediation: mediationCount,
      settled: settledCount,
      total: totalCount,
      disputeRate: totalCount > 0 ? ((openCount + mediationCount) / totalCount) * 100 : 0,
    };
  }
}
