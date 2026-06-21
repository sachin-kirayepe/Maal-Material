import { Injectable } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class SettlementsService {
  constructor(private readonly db: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async processSettlement(data: {
    customerId: string;
    amount: number;
    paymentMethod: string;
    referenceId?: string;
    processedBy: string;
    notes?: string;
  }) {

                try {
                  return this.db.$transaction(
        async (tx) => {
          // 1. Create Settlement record
          const settlement = await tx.settlement.create({
            data: {
              settlementNumber: "SET-" + Date.now(),
              customerId: data.customerId,
              amountApplied: data.amount,
              paymentMethod: data.paymentMethod,
              referenceId: data.referenceId,
              processedBy: data.processedBy,
              notes: data.notes,
            },
          });

          // 2. Find customer's ledger account
          const account = await tx.ledgerAccount.findUnique({
            where: { customerId: data.customerId },
          });

          if (account) {
            // 3. Record CREDIT to the ledger (customer paid us, so receivable decreases)
            // Record CREDIT manually to avoid SQLite nested transaction deadlock
            await tx.ledgerAccount.update({
              where: { id: account.id },
              data: { balance: { decrement: data.amount } },
            });

            await tx.ledgerEntry.create({
              data: {
                ledgerAccountId: account.id,
                transactionId: "TXN-" + Date.now(),
                referenceId: settlement.id,
                referenceType: "SETTLEMENT",
                description: `Payment Settlement ${settlement.settlementNumber}`,
                debit: 0,
                credit: data.amount,
                balance: account.balance - data.amount,
                createdBy: data.processedBy,
              },
            });
          }

          // 4. Update Credit Account if applicable
          const creditAcc = await tx.creditAccount.findUnique({
            where: { customerId: data.customerId },
          });

          if (creditAcc) {
            await tx.creditAccount.update({
              where: { id: creditAcc.id },
              data: {
                availableCredit: { increment: data.amount },
                totalDue: { decrement: data.amount },
              },
            });
          }

          return settlement;
        },
        { maxWait: 10000, timeout: 20000 },
      );
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'SettlementsService', 
                         action: 'processSettlement',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async getCustomerSettlements(customerId: string) {
    return this.db.settlement.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAllSettlements(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.db.settlement.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.db.settlement.count()
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}
