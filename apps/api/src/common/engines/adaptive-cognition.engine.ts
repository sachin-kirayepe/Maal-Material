import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * AdaptiveCognitionEngine — "The Model Optimizer" (Phase 3N)
 *
 * Dynamically adjusts the operational logic (`AdaptiveLearningModel`) of the platform
 * based on memory feedback loops, ensuring the system continually gets smarter over time.
 */
@Injectable()
export class AdaptiveCognitionEngine {
  private readonly logger = new Logger(AdaptiveCognitionEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Adapts a learning model based on new operational feedback.
   */
  async adaptModel(
    tenantId: string,
    modelContext: string,
    updatedWeights: unknown,
    learningRate: number,
  ) {
    this.logger.log(`Adapting Cognition Model for [${modelContext}] at rate ${learningRate}`);

    const existingModel = await this.prisma.adaptiveLearningModel.findFirst({
      where: { tenantId, modelContext },
    });

    if (existingModel) {
      return this.prisma.adaptiveLearningModel.update({
        where: { id: existingModel.id },
        data: {
          modelWeightsJson: JSON.stringify(updatedWeights),
          learningRate,
          lastAdaptedAt: new Date(),
        },
      });
    } else {
      return this.prisma.adaptiveLearningModel.create({
        data: {
          tenantId,
          modelContext,
          modelWeightsJson: JSON.stringify(updatedWeights),
          learningRate,
        },
      });
    }
  }

  /**
   * Retrieves the current, active cognition model for a specific operational context.
   */
  async getActiveModel(tenantId: string, modelContext: string) {
    return this.prisma.adaptiveLearningModel.findFirst({
      where: { tenantId, modelContext },
    });
  }
}
