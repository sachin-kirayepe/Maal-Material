import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import type { Request } from "express";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/is-public.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    
    // H-06 FIX: Extract token from HttpOnly cookie first, fallback to Authorization header
    let token = this.extractTokenFromHeader(request);
    if (!token && request.headers.cookie) {
      const match = request.headers.cookie.match(/(?:^|;\s*)constructos_access_token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      throw new UnauthorizedException("Authentication token is missing");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>("auth.jwtSecret"),
      });
      // Attach the payload to the request for decorators & downstream checks
      (request as any)["user"] = payload;
    } catch {
      throw new UnauthorizedException("Invalid or expired authentication token");
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
