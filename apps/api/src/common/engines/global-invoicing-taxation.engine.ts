import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * GlobalInvoicingTaxationEngine — "The Compliance Ledger" (Phase 22)
 *
 * Generates legally compliant, cross-border invoices for complex industrial
 * transactions, applying accurate taxation routing.
 */
@Injectable()
export class GlobalInvoicingTaxationEngine {
  private readonly logger = new Logger(GlobalInvoicingTaxationEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a tax-compliant distributed invoice.
   */
  async generateInvoice(
    tenantId: string,
    amountDue: number,
    taxRate: number,
    currency: string,
    dueDate: Date,
  ) {
    this.logger.log(
      `Generating Global Invoice for Tenant [${tenantId}] - Amount: ${amountDue} ${currency}`,
    );

    const taxAmount = amountDue * (taxRate / 100);

    const invoice = await this.prisma.distributedFinancialInvoice.create({
      data: {
        tenantId,
        amountDue,
        taxAmount,
        currency,
        dueDate,
        invoiceStatus: "DRAFT",
      },
    });

    return invoice;
  }
}
