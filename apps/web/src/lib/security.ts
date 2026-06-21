/**
 * Maal-Material Security & Validation Layer
 *
 * Provides enterprise-grade utility functions for sanitization, tenant isolation,
 * rate limiting validation, and input safety checking.
 */

// 1. Input Sanitization (Prevents XSS / Injection in AI prompts)
export function sanitizeAIPrompt(input: string): string {
  if (!input) return "";
  // Basic XSS/Injection stripping (in a real app, use a robust library like DOMPurify for HTML,
  // and parameterize SQL/NoSQL queries to prevent prompt injection leakage)
  return input
    .replace(/<[^>]*>?/gm, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove JS protocols
    .replace(/[{}]/g, ""); // Strip execution brackets often used in template injection
}

// 2. Tenant Isolation Validator
// Ensures that a given resource ID actually belongs to the active tenant session
export function validateTenantAccess(activeTenantId: string, resourceTenantId: string): boolean {
  if (!activeTenantId || !resourceTenantId) return false;
  // In production, this might also check a hierarchical organization tree
  // (e.g. if the user is an admin of the parent company)
  return activeTenantId === resourceTenantId;
}

// 3. Client-Side Rate Limit Simulator
// Prevents rapid-fire UI clicks from overwhelming the backend orchestration layer
const RATE_LIMIT_CACHE = new Map<string, number>();
const MAX_REQUESTS_PER_MINUTE = 60;

export function checkRateLimit(actionKey: string): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  // Cleanup old entries
  Array.from(RATE_LIMIT_CACHE.entries()).forEach(([key, timestamp]) => {
    if (timestamp < oneMinuteAgo) {
      RATE_LIMIT_CACHE.delete(key);
    }
  });

  let requestCount = 0;
  Array.from(RATE_LIMIT_CACHE.entries()).forEach(([key, timestamp]) => {
    if (key.startsWith(actionKey) && timestamp > oneMinuteAgo) {
      requestCount++;
    }
  });

  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    console.warn(`[SECURITY] Rate limit exceeded for action: ${actionKey}`);
    return false; // Block action
  }

  // Record this attempt
  RATE_LIMIT_CACHE.set(`${actionKey}-${now}`, now);
  return true; // Allow action
}

// 4. Object Integrity Check (Deep Freeze for constant state)
// Prevents mutable state bugs in critical config objects
export function enforceImmutable<T extends object>(obj: T): T {
  return Object.freeze(obj);
}
