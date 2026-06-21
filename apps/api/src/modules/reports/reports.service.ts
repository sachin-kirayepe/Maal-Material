import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getTemplates(tenantId?: string) {
    return this.prisma.reportTemplate.findMany({
      where: { ...(tenantId && { tenantId }) },
    });
  }

  async generateReport(templateId: string, tenantId: string, userId: string) {
    const template = await this.prisma.reportTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) throw new NotFoundException("Template not found");

    // Create the generation record
    const report = await this.prisma.generatedReport.create({
      data: {
        templateId,
        tenantId,
        generatedBy: userId,
        status: "GENERATING",
      },
    });

    // In a real system, we would dispatch a background job here via BullMQ
    // For now, we simulate quick generation
    setTimeout(async () => {
      try {
        // Mock data fetch based on template.queryConfig
        const snapshotData = { message: "Report generated successfully", timestamp: new Date() };

        await this.prisma.generatedReport.update({
          where: { id: report.id },
          data: {
            status: "COMPLETED",
            dataSnapshot: JSON.stringify(snapshotData),
            reportUrl: `/api/v1/reports/download/${report.id}`,
            completedAt: new Date(),
          },
        });
        this.logger.log(`Report ${report.id} generated successfully.`);
      } catch (err) {
        await this.prisma.generatedReport.update({
          where: { id: report.id },
          data: { status: "FAILED" },
        });
        this.logger.error(`Failed to generate report ${report.id}`);
      }
    }, 2000);

    return report;
  }

  async getGeneratedReports(tenantId?: string) {
    return this.prisma.generatedReport.findMany({
      where: { ...(tenantId && { tenantId }) },
      orderBy: { createdAt: "desc" },
      include: { reportTemplates: { select: { name: true } } },
    });
  }
}
