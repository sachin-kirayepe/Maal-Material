import { Injectable } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";

@Injectable()
export class DeploymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.deployment.findMany({
      where: { tenantId },
      include: { deploymentEvent: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async triggerDeployment(
    tenantId: string,
    version: string,
    environment: string,
    initiatorId: string,
  ) {
    const deployment = await this.prisma.deployment.create({
      data: {
        tenantId,
        version,
        environment,
        status: "DEPLOYING",
        initiatorId,
      },
    });

    await this.prisma.deploymentEvent.create({
      data: {
        deploymentId: deployment.id,
        state: "STARTED",
        message: "Deployment triggered by user",
      },
    });

    return deployment;
  }

  async rollbackDeployment(_tenantId: string, deploymentId: string) {
    const deployment = await this.prisma.deployment.update({
      where: { id: deploymentId },
      data: { status: "ROLLBACK_INITIATED" },
    });

    await this.prisma.deploymentEvent.create({
      data: {
        deploymentId,
        state: "ROLLBACK",
        message: "Rollback initiated by user",
      },
    });

    return deployment;
  }
}
