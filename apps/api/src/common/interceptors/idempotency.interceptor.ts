import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

/**
 * IdempotencyInterceptor enforces Exactly-Once processing semantics.
 * If a client sends an `Idempotency-Key` header, the system guarantees
 * the operation will only be executed once, even if the client retries
 * the exact same request due to network timeouts.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const idempotencyKey = request.headers['idempotency-key'];

    if (!idempotencyKey || request.method === 'GET') {
      return next.handle();
    }

    const tenantId = request.tenantId || 'global';
    const redisKey = `idempotency:${tenantId}:${idempotencyKey}`;

    // True distributed Redis check
    const existing = await this.redis.get(redisKey);

    if (existing) {
      if (existing === 'PROCESSING') {
        throw new ConflictException('Concurrent request with same idempotency key is already processing.');
      }
      // Return the cached response
      return of(JSON.parse(existing));
    }

    // Mark as processing with a true distributed Redis lock (expires in 1 minute to avoid deadlock)
    const setLock = await this.redis.set(redisKey, 'PROCESSING', 'EX', 60, 'NX');
    if (!setLock) {
        throw new ConflictException('Concurrent request with same idempotency key is already processing.');
    }

    return next.handle().pipe(
      tap(async (response) => {
        // Store the result for 24 hours
        await this.redis.set(redisKey, JSON.stringify(response), 'EX', 60 * 60 * 24);
      }),
    );
  }
}
