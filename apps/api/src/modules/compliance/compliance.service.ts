import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class ComplianceService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async getRecords(tenantId: string) {

                try {
                  return this.prisma.complianceRecord.findMany({
        where: { tenantId },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ComplianceService', 
                         action: 'getRecords',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async generateReport(tenantId: string, userId: string, reportType: string) {
    // Mocking report generation
    const periodEnd = new Date();
    const periodStart = new Date();
    periodStart.setMonth(periodStart.getMonth() - 1);

    const reportData = {
      status: "COMPLIANT",
      issuesFound: 0,
      generatedAt: new Date().toISOString(),
      reportType,
    };

    return this.prisma.complianceRecord.create({
      data: {
        tenantId,
        reportType,
        summary: `${reportType} report generated successfully.`,
        reportData: JSON.stringify(reportData),
        periodStart,
        periodEnd,
        generatedBy: userId,
      },
    });
  }
}
