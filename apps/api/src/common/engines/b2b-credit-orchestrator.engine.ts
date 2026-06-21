import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * B2BCreditOrchestratorEngine
 *
 * Automates the negotiation of trade credit between tenants.
 * Evaluates the Buyer's platform trust score to algorithmically recommend
 * Net-30 or Net-60 terms for the Supplier to offer.
 */
@Injectable()
export class B2BCreditOrchestratorEngine {
  private readonly logger = new Logger(B2BCreditOrchestratorEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates and establishes a B2B credit line between a supplier and a buyer.
   */
  async establishCreditLine(supplierTenantId: string, buyerTenantId: string) {
    this.logger.log(
      `Evaluating B2B Credit Line: Supplier [${supplierTenantId}] -> Buyer [${buyerTenantId}]`,
    );

    // Fetch the buyer's Trust Score
    const trustData = await (this.prisma as any).trustScore.findFirst({
      where: { tenantId: buyerTenantId }, // Using tenantId as a proxy for the entity
    });

    const score = trustData ? trustData.score : 50;

    // Algorithmic credit assignment
    let creditLimit = 0;
    let paymentTerms = "DUE_ON_RECEIPT";

    if (score > 85) {
      creditLimit = 100000;
      paymentTerms = "NET_60";
    } else if (score > 60) {
      creditLimit = 25000;
      paymentTerms = "NET_30";
    }

    this.logger.debug(`Algorithm Result: Limit $${creditLimit}, Terms: ${paymentTerms}`);

    return this.prisma.b2BFinancialCreditLine.upsert({
      where: { unique_b2b_credit: { supplierTenantId, buyerTenantId } },
      update: { creditLimit, availableCredit: creditLimit, paymentTerms },
      create: {
        supplierTenantId,
        buyerTenantId,
        creditLimit,
        availableCredit: creditLimit,
        paymentTerms,
        status: "ACTIVE",
      },
    });
  }
}
