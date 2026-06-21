import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * SettlementOrchestratorEngine
 *
 * Coordinates complex B2B and Marketplace settlements.
 * Manages multi-party funds splits, vendor payouts, and workforce wages.
 * Ensures financial consistency across the ecosystem.
 */
@Injectable()
export class SettlementOrchestratorEngine {
  private readonly logger = new Logger(SettlementOrchestratorEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Processes a marketplace settlement (split between platform fee and vendor net).
   */
  async processMarketplaceSettlement(
    tenantId: string,
    orderId: string,
    vendorId: string,
    totalAmount: number,
    feePercentage: number = 0.05,
  ) {
    this.logger.log(`Processing marketplace settlement for Order: ${orderId}, Vendor: ${vendorId}`);

    const platformFee = totalAmount * feePercentage;
    const netVendorAmount = totalAmount - platformFee;

    const settlement = await this.prisma.marketplaceSettlement.create({
      data: {
        orderId,
        vendorId,
        settlementAmount: totalAmount,
        platformFeeAmount: platformFee,
        netVendorAmount,
        settlementStatus: "PROCESSING",
      },
    });

    // In a real system, this would integrate with Stripe Connect / Razorpay Route
    // Simulating external payout success:
    const updated = await this.prisma.marketplaceSettlement.update({
      where: { id: settlement.id },
      data: {
        settlementStatus: "COMPLETED",
        processedAt: new Date(),
        transactionRef: `SETTLE_${Date.now()}`,
      },
    });

    this.eventDispatcher.dispatch("finance", "marketplace_settlement_completed", {
      tenantId,
      settlementId: updated.id,
      vendorId,
      netAmount: netVendorAmount,
    });

    return updated;
  }

  /**
   * Orchestrates a payout to a workforce member (wage, incentive, reimbursement).
   */
  async processWorkforcePayout(tenantId: string, workerId: string, amount: number, type: string) {
    this.logger.log(`Processing workforce payout (${type}) for worker: ${workerId}`);

    const payout = await this.prisma.workforcePayout.create({
      data: {
        tenantId,
        workerId,
        payoutAmount: amount,
        payoutType: type,
        status: "PROCESSING",
      },
    });

    // Simulating bank transfer success:
    const updated = await this.prisma.workforcePayout.update({
      where: { id: payout.id },
      data: { status: "COMPLETED", processedAt: new Date(), transactionRef: `WAGE_${Date.now()}` },
    });

    this.eventDispatcher.dispatch("finance", "workforce_payout_completed", {
      tenantId,
      payoutId: updated.id,
      workerId,
      amount,
      type,
    });

    return updated;
  }

  /**
   * Aggregates FinOps analytics for the tenant over a given period.
   */
  async generateFinOpsSnapshot(tenantId: string, periodStart: Date, periodEnd: Date) {
    this.logger.log(`Generating FinOps snapshot for tenant ${tenantId}`);

    // Aggregate inflows (Customer payments)
    const inflows = await this.prisma.payment.aggregate({
      where: { tenantId, unusedAmount: 0, paymentDate: { gte: periodStart, lte: periodEnd } },
      _sum: { totalAmount: true },
    });

    // Aggregate outflows (Supplier payments + Workforce payouts)
    const supplierOutflows = await this.prisma.supplierPayment.aggregate({
      where: { tenantId, paymentDate: { gte: periodStart, lte: periodEnd } },
      _sum: { amount: true },
    });

    const workforceOutflows = await this.prisma.workforcePayout.aggregate({
      where: { tenantId, status: "COMPLETED", processedAt: { gte: periodStart, lte: periodEnd } },
      _sum: { payoutAmount: true },
    });

    const totalIn = inflows._sum.totalAmount || 0;
    const totalOut =
      (supplierOutflows._sum.amount || 0) + (workforceOutflows._sum.payoutAmount || 0);

    const snapshot = await this.prisma.finOpsAnalytics.create({
      data: {
        tenantId,
        periodStart,
        periodEnd,
        totalInflow: totalIn,
        totalOutflow: totalOut,
        netCashflow: totalIn - totalOut,
      },
    });

    return snapshot;
  }
}
