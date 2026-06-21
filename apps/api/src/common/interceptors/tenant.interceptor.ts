import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { TenantContext } from "../context/tenant-context";

/**
 * TenantInterceptor prevents Multi-Tenant Fraud and hydrates the Node.js ALS Context.
 * It overrides any frontend-supplied tenantId parameters with the cryptographically
 * secure `secureTenantId` resolved by the TenantGuard.
 */
@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>("isPublic", [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const publicRoutes = ["/api/v1/auth/login", "/api/v1/auth/register", "/api/v1/auth/refresh", "/api/v1/health"];
    
    if (isPublic || publicRoutes.some(route => request.url.includes(route))) {
      return next.handle();
    }

    const secureTenantId = request.secureTenantId || request.user?.tenantId;

    if (!secureTenantId) {
      // For super admins or users without explicit tenant assignment,
      // proceed without tenant context (auth guards handle access control)
      return next.handle();
    }

    // Override Query Params
    if (request.query && request.query.tenantId) {
      request.query.tenantId = secureTenantId;
    }

    // Override Body Params (for POST/PATCH/PUT)
    if (request.body && typeof request.body === "object" && request.body.tenantId) {
      request.body.tenantId = secureTenantId;
    }

    // SECURITY P0: Hydrate the Zero-Trust ALS Context for the entire execution tree
    return new Observable((subscriber) => {
      TenantContext.run({ tenantId: secureTenantId }, () => {
        next.handle().subscribe(subscriber);
      });
    });
  }
}
