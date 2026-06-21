import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * CreditIntelligenceEngine
 *
 * Orchestrates credit limits and exposure analytics for ecosystem entities.
 * Automatically recalculates available credit and warns when exposure
 * exceeds safe thresholds. Integrates with the TrustScoringEngine data.
 */
@Injectable()
export class CreditIntelligenceEngine {
  private readonly logger = new Logger(CreditIntelligenceEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Recalculates available credit and overall exposure for an account.
   */
  async evaluateCreditExposure(tenantId: string, customerId: string) {
    this.logger.log(`Evaluating credit exposure for customer: ${customerId} (Tenant: ${tenantId})`);

    const account = await this.prisma.creditAccount.findUnique({
      where: { customerId },
    });

    if (!account || account.status !== "ACTIVE") {
      return null;
    }

    // 1. Calculate total outstanding debt from credit transactions
    const transactions = await this.prisma.creditTransaction.findMany({
      where: { tenantId, creditAccountId: account.id },
    });

    let totalDue = 0;
    for (const tx of transactions) {
      if (tx.type === "CHARGE") totalDue += tx.amount;
      if (tx.type === "PAYMENT" || tx.type === "REFUND") totalDue -= tx.amount;
    }

    // Ensure totalDue does not drop below 0 due to timing issues
    totalDue = Math.max(0, totalDue);
    const availableCredit = Math.max(0, account.creditLimit - totalDue);

    const updatedAccount = await this.prisma.creditAccount.update({
      where: { id: account.id },
      data: {
        totalDue,
        availableCredit,
        updatedAt: new Date(),
      },
    });

    // 2. Alert on High Exposure (>90% utilization)
    const utilization = totalDue / account.creditLimit;
    if (utilization > 0.9) {
      this.logger.warn(
        `High credit utilization detected for ${customerId}: ${(utilization * 100).toFixed(2)}%`,
      );

      this.eventDispatcher.dispatch("finance", "credit_exposure_high", {
        tenantId,
        customerId,
        accountId: account.id,
        utilization,
        availableCredit,
      });

      await this.prisma.operationalAlert.create({
        data: {
          tenantId,
          type: "CREDIT_EXPOSURE",
          severity: "HIGH",
          message: `Credit utilization for customer ${customerId} has exceeded 90%. Available: ${availableCredit}.`,
          source: "CreditIntelligenceEngine",
        },
      });
    }

    return updatedAccount;
  }

  /**
   * Adjusts credit limits dynamically based on trust score improvements or degrades.
   */
  async adjustLimitBasedOnTrust(tenantId: string, customerId: string, trustScore: number) {
    const account = await this.prisma.creditAccount.findUnique({ where: { customerId } });
    if (!account) return null;

    let multiplier = 1.0;
    if (trustScore > 800)
      multiplier = 1.2; // 20% increase for high trust
    else if (trustScore < 400)
      multiplier = 0.5; // 50% decrease for low trust
    else if (trustScore < 200) multiplier = 0; // Suspend credit

    const newLimit = Math.round(account.creditLimit * multiplier);

    if (newLimit !== account.creditLimit) {
      this.logger.log(
        `Adjusting credit limit for ${customerId} to ${newLimit} (Trust Score: ${trustScore})`,
      );

      const updated = await this.prisma.creditAccount.update({
        where: { id: account.id },
        data: { creditLimit: newLimit, availableCredit: Math.max(0, newLimit - account.totalDue) },
      });

      this.eventDispatcher.dispatch("finance", "credit_limit_adjusted", {
        tenantId,
        customerId,
        oldLimit: account.creditLimit,
        newLimit,
        reason: `Trust score changed to ${trustScore}`,
      });

      return updated;
    }

    return account;
  }
}
