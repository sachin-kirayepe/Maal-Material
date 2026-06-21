import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { PrismaService } from "../../database/prisma.service";
import { tenantContext } from "../context/tenant.context";

@Injectable()
export class AuditLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLoggingInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== "http") {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest();
    const { method, url, body, user } = req;

    // Only audit mutations (POST, PUT, PATCH, DELETE)
    if (["GET", "OPTIONS", "HEAD"].includes(method)) {
      return next.handle();
    }

    const tCtx = tenantContext.getStore();
    const tenantId = tCtx?.tenantId || null;
    const userId = user?.id || "SYSTEM";

    // Mask sensitive fields
    const maskedBody = { ...body };
    if (maskedBody.password) maskedBody.password = "***";
    if (maskedBody.token) maskedBody.token = "***";

    return next.handle().pipe(
      tap(async () => {
        try {
          // Asynchronously fire-and-forget the audit log to avoid blocking the response
          // We use the raw Prisma client (bypassing UOW proxies for independent commit)
          await this.prisma.fieldAuditLog.create({
            data: {
              tenantId,
              entityType: url.split("/")[1] || "UNKNOWN",
              entityId: "MUTATION", // Can be enriched if ID is in URL params
              action: method,
              performedBy: userId,
              newValues: JSON.stringify(maskedBody),
            },
          });
          this.logger.debug(`Audit log recorded for ${method} ${url} by user ${userId}`);
        } catch (err: unknown) {
          // Do not fail the transaction if audit log fails, just log it
          this.logger.error(`Failed to record audit log: ${(err as any).message}`);
        }
      }),
    );
  }
}
