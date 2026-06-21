import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { PrismaService } from "../../database/prisma.service";
import { uowContext } from "../context/uow.context";
import { from, lastValueFrom } from "rxjs";

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TransactionInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);

    if (!isMutation) {
      return next.handle();
    }

    this.logger.log(`Starting transactional boundaries for ${req.method} ${req.url}`);

    // We wrap the observable stream inside a Prisma interactive transaction.
    // The transaction client 'tx' is stored in AsyncLocalStorage so the PrismaService can use it implicitly.
    const runTransaction = async () => {
      return this.prisma.$transaction(
        async (tx) => {
          return new Promise((resolve, reject) => {
            uowContext.run({ tx }, () => {
              const stream$ = next.handle().pipe(
                tap(() =>
                  this.logger.log(`Mutation ${req.method} ${req.url} completed successfully.`),
                ),
                catchError((err) => {
                  this.logger.error(
                    `Mutation failed: ${req.method} ${req.url}. Exception handled, rolling back.`,
                    err.stack,
                  );
                  return throwError(() => err);
                }),
              );

              lastValueFrom(stream$).then(resolve).catch(reject);
            });
          });
        },
        {
          maxWait: 30000,
          timeout: 30000,
        },
      );
    };

    return from(runTransaction());
  }
}
