import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class LedgerService {
  constructor(private readonly db: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async createLedgerAccount(data: {
    customerId?: string;
    accountName: string;
    accountType?: string;
    initialBalance?: number;
  }) {

                try {
                  const accountNumber = "ACC-" + Date.now();

      return this.db.ledgerAccount.create({
        data: {
          accountNumber,
          accountName: data.accountName,
          customerId: data.customerId,
          accountType: data.accountType || "RECEIVABLE",
          balance: data.initialBalance || 0,
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'LedgerService', 
                         action: 'createLedgerAccount',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async recordTransaction(data: {
    ledgerAccountId: string;
    description: string;
    amount: number;
    type: "DEBIT" | "CREDIT";
    referenceId?: string;
    referenceType?: string;
    createdBy: string;
  }) {

                try {
                  return this.db.$transaction(async (tx) => {
        const account = await tx.ledgerAccount.findUnique({
          where: { id: data.ledgerAccountId },
        });

        if (!account) throw new BadRequestException("Ledger Account not found");

        let newBalance = account.balance;
        let debit = 0;
        let credit = 0;

        // DEBIT increases RECEIVABLE balance (customer owes more)
        // CREDIT decreases RECEIVABLE balance (customer paid us)
        if (data.type === "DEBIT") {
          debit = data.amount;
          newBalance += data.amount;
        } else {
          credit = data.amount;
          newBalance -= data.amount;
        }

        await tx.ledgerAccount.update({
          where: { id: account.id },
          data: { balance: newBalance },
        });

        return tx.ledgerEntry.create({
          data: {
            ledgerAccountId: account.id,
            description: data.description,
            debit,
            credit,
            balance: newBalance,
            referenceId: data.referenceId,
            referenceType: data.referenceType,
            createdBy: data.createdBy,
          },
        });
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'LedgerService', 
                         action: 'recordTransaction',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async getAccountBalance(accountId: string) {
    return this.db.ledgerAccount.findUnique({
      where: { id: accountId },
      include: { ledgerEntries: { orderBy: { createdAt: "desc" }, take: 50 } },
    });
  }

  async getCustomerLedger(customerId: string) {
    return this.db.ledgerAccount.findUnique({
      where: { customerId },
      include: { ledgerEntries: { orderBy: { createdAt: "desc" } } },
    });
  }

  async getAllEntries(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.db.ledgerEntry.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { ledgerAccounts: true }
      }),
      this.db.ledgerEntry.count()
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
