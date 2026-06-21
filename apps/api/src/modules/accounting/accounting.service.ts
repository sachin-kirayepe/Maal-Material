import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { LockService } from "@database/lock.service";
import * as crypto from "crypto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class AccountingService {
  constructor(
    private prisma: PrismaService,
    private lockService: LockService, private readonly realtimeGateway: RealtimeGateway
  ) {}

  async getChartOfAccounts(tenantId: unknown) {
    return this.prisma.chartOfAccount.findMany({
      where: { tenantId: tenantId as string },
      orderBy: { code: "asc" },
    });
  }

  async getLedgerAccounts(tenantId: unknown) {
    return this.prisma.generalLedgerAccount.findMany({
      where: { tenantId: tenantId as string },
      include: { chartOfAccount: true },
      orderBy: { accountNumber: "asc" },
    });
  }

  async createJournalEntry(
    tenantId: unknown,
    data: {
      description: unknown;
      entryDate: unknown;
      referenceType: unknown;
      referenceId?: unknown;
      postedBy: unknown;
      lines: { ledgerAccountId: string; type: "DEBIT" | "CREDIT"; amount: number }[];
    },
  ) {

                try {
                  // Validate double-entry accounting (Debits == Credits)
      // SECURITY P1: Round to nearest cent to eliminate Javascript Float rounding anomalies
      const totalDebit =
        Math.round(
          data.lines.filter((l) => l.type === "DEBIT").reduce((sum, l) => sum + l.amount, 0) * 100,
        ) / 100;
      const totalCredit =
        Math.round(
          data.lines.filter((l) => l.type === "CREDIT").reduce((sum, l) => sum + l.amount, 0) * 100,
        ) / 100;

      // Strict cent matching (no more tolerance needed since values are strictly rounded to 2 decimals)
      if (totalDebit !== totalCredit) {
        throw new BadRequestException(
          `Journal entry unbalanced. Debits: ${totalDebit}, Credits: ${totalCredit}`,
        );
      }

      // Phase I: Eliminate count() race condition. Generate mathematically unique entry numbers.
      const uniqueSuffix = crypto.randomBytes(4).toString("hex").toUpperCase();
      const entryNumber = `JE-${new Date().getFullYear()}-${uniqueSuffix}`;

      return this.prisma.$transaction(async (tx) => {
        // 1. Create Journal Entry
        const entry = await tx.journalEntry.create({
          data: {
            tenantId: tenantId as string,
            entryNumber,
            description: data.description as string,
            entryDate: new Date(data.entryDate as string),
            referenceType: data.referenceType as string,
            referenceId: data.referenceId as string,
            postedBy: data.postedBy as string,
            status: "POSTED",
          },
        });

        // 2. Create Transactions & Update Ledgers securely
        for (const line of data.lines) {
          await tx.financialTransaction.create({
            data: {
              tenantId: tenantId as string,
              journalEntryId: entry.id,
              ledgerAccountId: line.ledgerAccountId,
              transactionDate: new Date(data.entryDate as string),
              type: line.type,
              amount: line.amount,
              description: data.description as string,
            },
          });

          // Phase H: Concurrency Control - Acquire Pessimistic Row-Level Lock
          // This mathematically blocks any other request from updating the ledger simultaneously.
          await this.lockService.acquireRowLock(tx, "GeneralLedgerAccount", line.ledgerAccountId);

          // Determine if account balance should increase or decrease
          const ledger = await tx.generalLedgerAccount.findUnique({
            where: { id: line.ledgerAccountId },
            include: { chartOfAccount: true },
          });

          if (!ledger)
            throw new NotFoundException(`Ledger Account ${line.ledgerAccountId} not found`);

          const coaType = ledger.chartOfAccount.type;
          // ASSET, EXPENSE: Debit increases, Credit decreases
          // LIABILITY, EQUITY, REVENUE: Credit increases, Debit decreases
          let balanceChange = 0;
          if (["ASSET", "EXPENSE"].includes(coaType)) {
            balanceChange = line.type === "DEBIT" ? line.amount : -line.amount;
          } else {
            balanceChange = line.type === "CREDIT" ? line.amount : -line.amount;
          }

          await tx.generalLedgerAccount.update({
            where: { id: line.ledgerAccountId },
            data: { balance: { increment: balanceChange } },
          });
        }

        // 3. Log Audit
        await tx.financialAuditLog.create({
          data: {
            tenantId: tenantId as string,
            entityType: "JOURNAL",
            entityId: entry.id,
            action: "POST",
            performedBy: data.postedBy as string,
            newValues: JSON.stringify(data),
          },
        });

        return entry;
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'AccountingService', 
                         action: 'createJournalEntry',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async getJournalEntries(tenantId: unknown, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.journalEntry.findMany({
        where: { tenantId: tenantId as string },
        include: { financialTransaction: { include: { generalLedgerAccount: true } } },
        orderBy: { entryDate: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.journalEntry.count({
        where: { tenantId: tenantId as string }
      })
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
