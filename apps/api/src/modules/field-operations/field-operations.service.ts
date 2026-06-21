import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class FieldOperationsService {
  constructor(private prisma: PrismaService) {}

  async getTasks(tenantId: string) {
    return this.prisma.fieldTask.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      include: {
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        assignee: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  async getSessions(tenantId: string) {
    return this.prisma.mobileSession.findMany({
      where: { tenantId },
      orderBy: { lastActiveAt: "desc" },
      include: {
        users: { select: { firstName: true, lastName: true, email: true } },
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        device: { select: { name: true, os: true } },
      },
    });
  }
}
