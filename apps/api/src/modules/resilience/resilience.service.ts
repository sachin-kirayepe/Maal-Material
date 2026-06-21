import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class ResilienceService {
  constructor(private readonly prisma: PrismaService) {}

  async getFailures(tenantId: string) {
    return this.prisma.failureEvent.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  async getRetries(tenantId: string) {
    return this.prisma.retryQueue.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  async resolveFailure(tenantId: string, id: string) {
    return this.prisma.failureEvent.update({
      where: { id, tenantId },
      data: { isResolved: true, resolvedAt: new Date() },
    });
  }

  async logFailure(
    tenantId: string | null,
    serviceName: string,
    errorType: string,
    message: string,
    stackTrace?: string,
    contextData?: unknown,
  ) {
    return this.prisma.failureEvent.create({
      data: {
        tenantId,
        serviceName,
        errorType,
        message,
        stackTrace,
        contextData: contextData ? JSON.stringify(contextData) : null,
      },
    });
  }
}
