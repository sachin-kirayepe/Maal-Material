import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class TaxService {
  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async getTaxRules(tenantId: string) {
    return this.prisma.taxRule.findMany({ where: { tenantId } });
  }

  async calculateTax(tenantId: string, ruleId: string, taxableAmount: number) {
    const rule = await this.prisma.taxRule.findUnique({ where: { id: ruleId, tenantId } });
    if (!rule) throw new NotFoundException("Tax rule not found");

    const taxAmount = (taxableAmount * rule.taxRate) / 100;
    return {
      taxableAmount,
      taxAmount,
      totalAmount: taxableAmount + taxAmount,
      rule,
    };
  }

  async createTaxRecord(
    tenantId: string,
    data: {
      taxRuleId: string;
      referenceType: string;
      referenceId: string;
      taxableAmount: number;
    },
  ) {

                try {
                  const calculation = await this.calculateTax(tenantId, data.taxRuleId, data.taxableAmount);

      return this.prisma.taxRecord.create({
        data: {
          tenantId,
          taxRuleId: data.taxRuleId,
          referenceType: data.referenceType,
          referenceId: data.referenceId,
          taxableAmount: data.taxableAmount,
          taxAmount: calculation.taxAmount,
          status: "UNPAID",
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'TaxService', 
                         action: 'createTaxRecord',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async getTaxRecords(tenantId: string, page: number = 1, limit: number = 10) {

                try {
                  const skip = (page - 1) * limit;
      const [items, total] = await Promise.all([
        this.prisma.taxRecord.findMany({
          where: { tenantId },
          include: { taxRule: true },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        this.prisma.taxRecord.count({ where: { tenantId } })
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
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'TaxService', 
                         action: 'getTaxRecords',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }
}
