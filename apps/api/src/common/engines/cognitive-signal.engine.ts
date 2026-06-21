import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CognitiveSignalEngine — "The Neural Transmitter" (Phase 3J)
 *
 * Ingests, filters, and routes high-velocity `CognitiveSignal` data packets
 * propagating between the nodes of the neural fabric.
 */
@Injectable()
export class CognitiveSignalEngine {
  private readonly logger = new Logger(CognitiveSignalEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fires a new cognitive signal into the enterprise neural fabric.
   */
  async emitSignal(
    tenantId: string,
    originNodeId: string,
    signalType: string,
    velocity: number,
    payload: unknown,
  ) {
    this.logger.debug(
      `Emitting Cognitive Signal: [${signalType}] from Node [${originNodeId}] with velocity ${velocity}`,
    );

    return this.prisma.cognitiveSignal.create({
      data: {
        tenantId,
        originNodeId,
        signalType,
        velocity,
        payloadJson: JSON.stringify(payload),
        processed: false,
      },
    });
  }

  /**
   * Retrieves unprocessed, high-velocity signals for the aggregation engine.
   */
  async pullUnprocessedSignals(tenantId: string, limit: number = 100) {
    return this.prisma.cognitiveSignal.findMany({
      where: { tenantId, processed: false },
      orderBy: { velocity: "desc" }, // High velocity (urgent) signals process first
      take: limit,
    });
  }

  /**
   * Marks signals as processed once they are absorbed into the neural sync state.
   */
  async acknowledgeSignals(signalIds: string[]) {
    return this.prisma.cognitiveSignal.updateMany({
      where: { id: { in: signalIds } },
      data: { processed: true },
    });
  }
}
