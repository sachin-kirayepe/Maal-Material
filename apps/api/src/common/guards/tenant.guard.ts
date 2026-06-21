import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

/**
 * TenantGuard prevents Multi-Tenant Fraud.
 * It strictly extracts and validates the tenantId from the signed JWT Bearer Token,
 * completely rejecting the unsafe 'x-tenant-id' header vulnerability.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  // In a real application, the JwtService would be injected here.
  // We initialize a transient instance for global guard simplicity if it's not injected.
  private jwtService = new JwtService({
    secret: process.env.JWT_SECRET || "constructos-super-secret",
  });

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid Authorization header.");
    }

    const token = authHeader.split(" ")[1];

    try {
      // Decode and verify mathematically signed payload
      const payload = this.jwtService.verify(token);

      if (!payload || !payload.tenantId) {
        throw new UnauthorizedException("JWT payload missing tenantId context.");
      }

      // Bind it securely to the request object so Interceptors can use it globally
      request.secureTenantId = payload.tenantId;
      (request as any).user = payload; // Attach full user payload

      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired Token. Tenant isolation enforced.");
    }
  }
}
