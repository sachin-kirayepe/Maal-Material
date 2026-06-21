import { Injectable } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { RealtimeGateway } from "../realtime/realtime.gateway";

@Injectable()
export class ActivityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async logActivity(data: {
    tenantId?: string;
    actorId?: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata?: unknown;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const activity = await this.prisma.activityLog.create({
      data: {
        ...(data as any),
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      } as any,
      include: {
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        actor: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    // Broadcast activity stream update to tenant
    if (data.tenantId) {
      this.realtimeGateway.broadcastToTenant(data.tenantId, "activity.new", activity);
    }

    return activity;
  }

  async getActivities(tenantId: string, limit = 100) {
    return this.prisma.activityLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        actor: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }
}
