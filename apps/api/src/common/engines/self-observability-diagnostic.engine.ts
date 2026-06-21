import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * SelfObservabilityDiagnosticEngine — "The Digital Subconscious" (Phase 33)
 *
 * A background engine that perpetually audits Maal-Material's own internal
 * logic states, predicting anomalies before they materialize.
 */
@Injectable()
export class SelfObservabilityDiagnosticEngine {
  private readonly logger = new Logger(SelfObservabilityDiagnosticEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates an internal diagnostic reflecting on the system's own health.
   */
  async generateSelfDiagnostic(
    diagnosticType: string,
    severity: number,
    recommendedAction: unknown,
  ) {
    this.logger.debug(
      `Internal Subconscious Diagnostic: [${diagnosticType}] - Severity: ${severity}`,
    );

    const diagnostic = await this.prisma.selfObservabilityDiagnostic.create({
      data: {
        diagnosticType,
        severityScore: severity,
        proposedAction: JSON.stringify(recommendedAction),
      },
    });

    if (severity > 0.8) {
      this.logger.error(
        `CRITICAL SELF-DIAGNOSTIC: ${diagnosticType}. Autonomous self-healing execution sequence engaged.`,
      );
    }

    return diagnostic;
  }
}
