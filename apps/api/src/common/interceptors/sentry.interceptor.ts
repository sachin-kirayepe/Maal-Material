import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

/**
 * Global Sentry Interceptor
 * Catches all unhandled exceptions occurring in controllers/services
 * and automatically logs the stack trace and request context to Sentry APM.
 */
@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Report error to Sentry
        Sentry.captureException(error, {
          tags: {
            layer: 'API',
          },
          extra: {
            context: context.getClass().name,
            handler: context.getHandler().name,
          },
        });
        throw error;
      }),
    );
  }
}
