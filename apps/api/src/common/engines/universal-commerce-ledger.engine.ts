import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { MegaEcosystemGovernanceEngine } from "./mega-ecosystem-governance.engine";

/**
 * UniversalCommerceLedgerEngine — "The Universal Cashier"
 *
 * Orchestrates financial clearing for transactions, remaining completely
 * agnostic to whether the transaction was a service, a physical product,
 * or an equipment rental.
 */
@Injectable()
export class UniversalCommerceLedgerEngine {
  private readonly logger = new Logger(UniversalCommerceLedgerEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly governance: MegaEcosystemGovernanceEngine,
  ) {}

  /**
   * Records a pending financial transaction between two ecosystem participants.
   * Agnostic to the industry domain, but validates authority first.
   */
  async recordTransaction(
    tenantId: string,
    buyerEntityId: string,
    sellerEntityId: string,
    domainName: string,
    amount: number,
    transactionType: string,
    currency: string = "USD",
  ) {
    this.logger.log(
      `Recording Universal Transaction: [${buyerEntityId}] -> [${sellerEntityId}] for ${amount} ${currency} (Domain: ${domainName})`,
    );

    // Verify the seller actually has authority in this domain
    const isAuthorized = await this.governance.verifyParticipantDomainAuthority(
      tenantId,
      sellerEntityId,
      domainName,
    );

    if (!isAuthorized) {
      throw new Error(
        `Transaction Rejected: Seller [${sellerEntityId}] is not authorized to sell in domain [${domainName}].`,
      );
    }

    return this.prisma.universalCommerceTransaction.create({
      data: {
        tenantId,
        buyerEntityId,
        sellerEntityId,
        domainName,
        amount,
        currency,
        transactionType,
        status: "PENDING",
      },
    });
  }

  /**
   * Clears a transaction once payment is settled across the network.
   */
  async clearTransaction(transactionId: string) {
    this.logger.log(`Clearing Transaction [${transactionId}]`);

    return this.prisma.universalCommerceTransaction.update({
      where: { id: transactionId },
      data: { status: "CLEARED" },
    });
  }
}
