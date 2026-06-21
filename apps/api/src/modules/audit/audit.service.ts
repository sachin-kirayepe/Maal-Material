import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async getTrails(tenantId: string) {
    return this.prisma.auditTrail.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  async logAction(
    tenantId: string | null,
    userId: string | null,
    action: string,
    entityType: string,
    entityId: string,
    oldData?: unknown,
    newData?: unknown,
  ) {
    return this.prisma.auditTrail.create({
      data: {
        tenantId,
        userId,
        action,
        entityType,
        entityId,
        oldData: oldData ? JSON.stringify(oldData) : null,
        newData: newData ? JSON.stringify(newData) : null,
      },
    });
  }
}
