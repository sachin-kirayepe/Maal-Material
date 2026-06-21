import { Injectable } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";

@Injectable()
export class DevopsService {
  constructor(private prisma: PrismaService) {}

  async getPipelines(tenantId: string) {
    return this.prisma.pipelineExecution.findMany({
      where: { tenantId },
      orderBy: { startedAt: "desc" },
      take: 20,
    });
  }

  async triggerPipeline(tenantId: string, pipelineName: string, branch: string) {
    return this.prisma.pipelineExecution.create({
      data: {
        tenantId,
        pipelineName,
        branch,
        status: "RUNNING",
      },
    });
  }

  async getEnvironmentConfigs(tenantId: string) {
    return this.prisma.environmentConfig.findMany({
      where: { tenantId },
      orderBy: { environment: "asc" },
    });
  }
}
