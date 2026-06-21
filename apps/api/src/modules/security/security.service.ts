import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class SecurityService {
  constructor(private readonly prisma: PrismaService) {}

  async getEvents(tenantId: string) {
    return this.prisma.securityEvent.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }

  async blockIp(tenantId: string, ipAddress: string) {
    // We log a SecurityEvent and block rate limit
    await this.prisma.securityEvent.create({
      data: {
        tenantId,
        eventType: "IP_BLOCKED",
        severity: "CRITICAL",
        ipAddress,
        metadata: JSON.stringify({ reason: "Manual Block" }),
      },
    });

    return { message: `IP ${ipAddress} blocked successfully` };
  }

  async logEvent(
    tenantId: string | null,
    userId: string | null,
    eventType: string,
    severity: string,
    metadata: unknown,
    ipAddress?: string,
    userAgent?: string,
  ) {
    return this.prisma.securityEvent.create({
      data: {
        tenantId,
        userId,
        eventType,
        severity,
        metadata: JSON.stringify(metadata),
        ipAddress,
        userAgent,
      },
    });
  }
}
