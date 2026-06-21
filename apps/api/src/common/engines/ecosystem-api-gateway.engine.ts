import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import * as crypto from "crypto";

/**
 * EcosystemAPIGatewayEngine — "The Ecosystem Bouncer" (Phase 23)
 *
 * Aggressively polices inbound API traffic from external plugins, enforcing
 * cryptographic scopes and strict rate limits.
 */
@Injectable()
export class EcosystemAPIGatewayEngine {
  private readonly logger = new Logger(EcosystemAPIGatewayEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Authenticates and authorizes an inbound plugin API call.
   */
  async authorizeCall(apiKey: string, requestedScope: string) {
    const apiKeyHash = crypto.createHash("sha256").update(apiKey).digest("hex");

    this.logger.debug(`Authorizing Plugin API Call - Scope: ${requestedScope}`);

    const auth = await (this.prisma as any).pluginAPIAuthorization.findUnique({
      where: { apiKeyHash },
    });

    if (!auth) {
      throw new UnauthorizedException("Invalid Plugin API Key");
    }

    const scopes = JSON.parse(auth.scopes) as string[];
    if (!scopes.includes(requestedScope)) {
      throw new UnauthorizedException(`Plugin not authorized for scope: ${requestedScope}`);
    }

    if (auth.callsMade >= auth.quotaLimit) {
      throw new UnauthorizedException("Plugin API Quota Exceeded");
    }

    // Increment call count
    await (this.prisma as any).pluginAPIAuthorization.update({
      where: { id: auth.id },
      data: { callsMade: { increment: 1 } },
    });

    return true;
  }
}
