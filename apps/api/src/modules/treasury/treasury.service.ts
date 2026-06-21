import { Injectable } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class TreasuryService {
  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async getBankAccounts(tenantId: string) {
    return this.prisma.bankAccount.findMany({
      where: { tenantId },
      orderBy: { bankName: "asc" },
    });
  }

  async getTreasuryBalance(tenantId: string) {
    const accounts = await this.prisma.bankAccount.findMany({ where: { tenantId } });
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

    return {
      totalAccounts: accounts.length,
      totalBalance,
      currency: "USD",
    };
  }

  async createBankAccount(tenantId: string, data: unknown) {

                try {
                  return this.prisma.bankAccount.create({
        data: {
          tenantId,
          bankName: (data as any).bankName,
          accountNumber: (data as any).accountNumber,
          accountType: (data as any).accountType,
          currency: (data as any).currency || "USD",
          currentBalance: (data as any).currentBalance || 0,
          routingNumber: (data as any).routingNumber,
          swiftCode: (data as any).swiftCode,
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'TreasuryService', 
                         action: 'createBankAccount',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }
}
