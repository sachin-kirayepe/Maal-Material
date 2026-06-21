import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EnterpriseApiGatewayEngine — "The Bouncer" (Phase 15)
 *
 * The intelligent entry point for all external enterprise systems plugging
 * into the Maal-Material global cloud fabric.
 */
@Injectable()
export class EnterpriseApiGatewayEngine {
  private readonly logger = new Logger(EnterpriseApiGatewayEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Initializes a secure API session for an external integration.
   */
  async initializeSession(tenantId: string, developerId: string, permissions: unknown) {
    this.logger.log(
      `Initializing API Gateway Session for Developer [${developerId}] under Tenant [${tenantId}]`,
    );

    const portal = await this.prisma.developerEcosystemPortal.findUnique({
      where: { id: developerId },
    });

    if (!portal || !portal.isVerified) {
      this.logger.error(
        `API_ACCESS_DENIED: Developer [${developerId}] is not verified in the ecosystem.`,
      );
      throw new Error("API_ACCESS_DENIED");
    }

    const session = await this.prisma.enterpriseApiGatewaySession.create({
      data: {
        tenantId,
        developerId,
        sessionTokenHash: `SECURE_HASH_${Date.now()}_${Math.random()}`,
        permissions: JSON.stringify(permissions),
        isActive: true,
        expiresAt: new Date(Date.now() + 86400000), // 24 hours
      },
    });

    return session;
  }
}
