import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { WsException } from "@nestjs/websockets";
import { PrismaService } from "@database/prisma.service";

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = this.extractTokenFromHeader(client);

    if (!token) {
      throw new WsException("Unauthorized");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || "super-secret-constructos-key",
      });

      const user = await this.prisma.user!.findUnique({
        where: { id: payload.sub },
        include: { userRoles: { include: { roles: true } } },
      });

      if (!user || !user!.isActive) {
        throw new WsException("Unauthorized");
      }

      // Attach user and tenant info to the socket client for the entire lifecycle
      (client as any).user = user;
      client.tenantId = payload.tenantId;

      return true;
    } catch (err) {
      throw new WsException("Unauthorized");
    }
  }

  private extractTokenFromHeader(client: unknown): string | undefined {
    // Check both standard auth headers and handshake headers
    const authHeader = (client as any).handshake?.headers?.authorization;
    if (authHeader && authHeader.split(" ")[0] === "Bearer") {
      return authHeader.split(" ")[1];
    }

    // Also check handshake query for token (often used in JS websockets if headers aren't supported)
    const queryToken = (client as any).handshake?.query?.token;
    if (queryToken) {
      return queryToken;
    }

    return undefined;
  }
}
