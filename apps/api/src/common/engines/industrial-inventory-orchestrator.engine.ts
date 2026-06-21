import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * IndustrialInventoryOrchestratorEngine — "The Stock Controller" (Phase 28)
 *
 * Tracks physical inventory movements and anomalies, triggering automated
 * procurement workflows before actual shortages occur.
 */
@Injectable()
export class IndustrialInventoryOrchestratorEngine {
  private readonly logger = new Logger(IndustrialInventoryOrchestratorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a physical inventory transaction.
   */
  async recordInventoryTransaction(
    nodeId: string,
    skuId: string,
    quantity: number,
    type: string,
    isAnomaly: boolean,
  ) {
    this.logger.debug(
      `Inventory Transaction: [${type}] ${quantity} units of SKU [${skuId}] at Node [${nodeId}]`,
    );

    const ledger = await this.prisma.industrialInventoryLedger.create({
      data: {
        nodeId,
        skuId,
        quantity,
        transactionType: type,
        anomalyFlag: isAnomaly,
      },
    });

    if (isAnomaly) {
      this.logger.error(
        `INVENTORY ANOMALY DETECTED: Physical shrinkage or system mismatch for SKU [${skuId}]. Initiating audit.`,
      );
    }

    return ledger;
  }
}
