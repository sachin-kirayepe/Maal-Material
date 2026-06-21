import { AsyncLocalStorage } from "async_hooks";

export interface ITenantContext {
  tenantId: string;
}

/**
 * TenantContext provides a Node.js AsyncLocalStorage mechanism to propagate
 * the authenticated tenantId across the entire execution stack (Controllers -> Services -> Prisma)
 * without needing to explicitly pass it down the function chains.
 */
export const TenantContext = new AsyncLocalStorage<ITenantContext>();
