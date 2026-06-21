import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

/**
 * Enterprise Validation Layer
 *
 * Ensures cross-module transaction integrity and flags abnormal behaviors
 * before they poison the database state.
 */
@Injectable()
export class TransactionIntegrityInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TransactionIntegrityInterceptor.name);

  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body } = req;

    // Example: Only inspect POST/PUT/PATCH mutations
    if (["POST", "PUT", "PATCH"].includes(method)) {
      this.logger.debug(`[Transaction Validation] Inspecting mutation on ${url}`);

      // Perform pre-flight anomaly checks here
      // For instance, check if the request payload attempts to put stock into negative
      if (body?.quantity && body?.quantity < 0) {
        throw new BadRequestException(
          "Negative quantities are strictly prohibited by enterprise rules.",
        );
      }
    }

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const timeTaken = Date.now() - now;
        if (timeTaken > 2000) {
          this.logger.warn(
            `[Anomaly Detection] Mutation on ${url} took unusually long (${timeTaken}ms).`,
          );
          // Note: Later, this can dispatch to the AnomalyEvent table asynchronously
        }
      }),
      catchError((error) => {
        // Log severe transaction aborts
        this.logger.error(`[Transaction Aborted] ${url} - Error: ${error.message}`);
        return throwError(() => error);
      }),
    );
  }
}
