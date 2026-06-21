import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * SupplierFinancingEngine
 *
 * Orchestrates dynamic invoice factoring. Allows a supplier to receive
 * instant liquidity for an invoice based on the Buyer's creditworthiness.
 */
@Injectable()
export class SupplierFinancingEngine {
  private readonly logger = new Logger(SupplierFinancingEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Processes a request for instant invoice financing.
   */
  async requestInvoiceFinancing(
    supplierTenantId: string,
    buyerTenantId: string,
    invoiceId: string,
    invoiceAmount: number,
  ) {
    this.logger.log(`Processing Financing Request for Invoice [${invoiceId}] - $${invoiceAmount}`);

    // Verify buyer's credit line
    const creditLine = await this.prisma.b2BFinancialCreditLine.findUnique({
      where: { unique_b2b_credit: { supplierTenantId, buyerTenantId } },
    });

    if (!creditLine || creditLine.status !== "ACTIVE") {
      throw new Error("No active credit line established between parties.");
    }

    // Dynamic Discount Rate based on Buyer's payment terms
    // E.g., Net-60 is riskier/takes longer than Net-30, so higher discount
    let discountRate = 0.05; // 5% base
    if (creditLine.paymentTerms === "NET_60") discountRate = 0.08;
    if (creditLine.paymentTerms === "NET_30") discountRate = 0.03;

    const advanceAmount = invoiceAmount * (1 - discountRate);

    this.logger.debug(`Financing Approved. Advance: $${advanceAmount}, Rate: ${discountRate}`);

    return this.prisma.supplierFinancingContract.create({
      data: {
        tenantId: supplierTenantId,
        buyerTenantId,
        invoiceId,
        invoiceAmount,
        advanceAmount,
        discountRate,
        status: "FUNDED",
        fundedAt: new Date(),
      },
    });
  }
}
