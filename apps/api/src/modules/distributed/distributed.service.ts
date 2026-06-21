import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class DistributedService {
  constructor(private prisma: PrismaService) {}

  async getTasks(tenantId: string) {
    return this.prisma.distributedTask.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async dispatchTask(tenantId: string, taskType: string, payload: unknown) {
    return this.prisma.distributedTask.create({
      data: {
        tenantId,
        taskType,
        payload: JSON.stringify(payload),
      },
    });
  }

  async retryTask(tenantId: string, taskId: string) {
    return this.prisma.distributedTask.updateMany({
      where: { id: taskId, tenantId },
      data: { status: "RETRYING", nextRetryAt: new Date(), retryCount: { increment: 1 } },
    });
  }
}
