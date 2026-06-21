import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { correlationContext } from "../context/correlation.context";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HttpRequestLogger");

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        const ctx = correlationContext.getStore();
        const cid = ctx ? `[CID: ${ctx.correlationId}] ` : "";
        this.logger.log(`${cid}[${method}] ${url} - Success - ${delay}ms`);
      }),
    );
  }
}
