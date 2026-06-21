import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * FaultDetectionEngine — "The Sentinel"
 *
 * Ingests infrastructure fault events, correlates them by domain and time window,
 * and determines if a known recovery playbook should be triggered.
 */
@Injectable()
export class FaultDetectionEngine {
  private readonly logger = new Logger(FaultDetectionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a fault event and checks if a matching recovery playbook exists.
   */
  async ingestFault(
    tenantId: string,
    faultDomain: string,
    severity: string,
    faultSignature: string,
    metadata: unknown,
    correlationId?: string,
  ) {
    this.logger.warn(
      `FAULT DETECTED in [${faultDomain}] — Severity: ${severity} — Signature: ${faultSignature}`,
    );

    // 1. Persist the immutable fault event
    const fault = await this.prisma.infrastructureFaultEvent.create({
      data: {
        tenantId,
        faultDomain,
        severity,
        faultSignature,
        correlationId,
        metadata: JSON.stringify(metadata),
      },
    });

    // 2. Search for an active recovery playbook matching this fault signature
    const playbook = await this.prisma.recoveryPlaybook.findFirst({
      where: {
        tenantId,
        triggerSignature: faultSignature,
        isActive: true,
      },
    });

    if (playbook) {
      this.logger.log(
        `Matched Playbook [${playbook.playbookName}] for fault signature [${faultSignature}].`,
      );
      return { fault, matchedPlaybook: playbook };
    }

    this.logger.debug(
      `No recovery playbook found for signature [${faultSignature}]. Event logged for manual triage.`,
    );
    return { fault, matchedPlaybook: null };
  }

  /**
   * Retrieves correlated faults within a time window for root-cause analysis.
   */
  async getCorrelatedFaults(correlationId: string) {
    return this.prisma.infrastructureFaultEvent.findMany({
      where: { correlationId },
      orderBy: { detectedAt: "asc" },
    });
  }
}
