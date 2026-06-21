import { Injectable, CanActivate, ExecutionContext, ConflictException } from "@nestjs/common";

/**
 * IdempotencyGuard prevents duplicate request execution (e.g., double clicks on payment/approval).
 * It expects the frontend to send an `x-idempotency-key` header.
 * If the exact same key is seen within the TTL window, the request is rejected.
 * 
 * H-02 NOTE: For multi-instance deployments, replace this with Redis-backed storage.
 * This in-memory implementation works for single-instance deployments only.
 */
@Injectable()
export class IdempotencyGuard implements CanActivate {
  private cache = new Map<string, number>();
  private readonly TTL_MS = 60000; // 60 seconds
  private readonly MAX_CACHE_SIZE = 50000;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Only enforce idempotency on state-mutating requests
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) {
      const idempotencyKey = request.headers["x-idempotency-key"];

      if (!idempotencyKey) {
        // H-03: Frontend now auto-generates keys, but allow legacy clients to pass through
        return true;
      }

      const now = Date.now();
      const cachedTime = this.cache.get(idempotencyKey);

      if (cachedTime && now - cachedTime < this.TTL_MS) {
        throw new ConflictException(
          `Duplicate request detected. Idempotency key ${idempotencyKey} has already been processed.`,
        );
      }

      // Store the key
      this.cache.set(idempotencyKey, now);

      // M-05 FIX: Smart eviction — only remove expired keys, don't wipe entire cache
      if (this.cache.size > this.MAX_CACHE_SIZE) {
        const keysToDelete: string[] = [];
        for (const [key, timestamp] of this.cache.entries()) {
          if (now - timestamp >= this.TTL_MS) {
            keysToDelete.push(key);
          }
          // Stop early if we've freed enough space
          if (keysToDelete.length > this.MAX_CACHE_SIZE / 2) break;
        }
        keysToDelete.forEach((key) => this.cache.delete(key));
      }
    }

    return true;
  }
}
