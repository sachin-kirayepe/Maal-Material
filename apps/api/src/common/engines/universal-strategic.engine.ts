import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * UniversalStrategicEngine — "The Predictive Architect" (Phase 3U)
 *
 * Orchestrates and continuously updates the UniversalStrategicMatrix,
 * providing a 30-to-90 day forward-looking operational projection.
 */
@Injectable()
export class UniversalStrategicEngine {
  private readonly logger = new Logger(UniversalStrategicEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates or updates the long-term predictive strategic matrix.
   */
  async updateStrategicMatrix(tenantId: string, forecastTopology: unknown, horizon: number = 90) {
    this.logger.log(
      `Updating Universal Strategic Matrix for Tenant: ${tenantId} [Horizon: ${horizon} days]`,
    );

    const matrix = await this.prisma.universalStrategicMatrix.findFirst({
      where: { tenantId },
    });

    if (matrix) {
      return this.prisma.universalStrategicMatrix.update({
        where: { id: matrix.id },
        data: {
          strategicTopologyJson: JSON.stringify(forecastTopology),
          forecastHorizonDays: horizon,
          confidenceScore: this.calculateConfidence(forecastTopology),
          lastForecastAt: new Date(),
        },
      });
    } else {
      return this.prisma.universalStrategicMatrix.create({
        data: {
          tenantId,
          strategicTopologyJson: JSON.stringify(forecastTopology),
          forecastHorizonDays: horizon,
          confidenceScore: this.calculateConfidence(forecastTopology),
        },
      });
    }
  }

  private calculateConfidence(topology: unknown): number {
    return 0.85; // Placeholder AI confidence metric
  }
}
