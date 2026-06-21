import { AsyncLocalStorage } from "async_hooks";

export interface TenantContextData {
  tenantId?: string;
  shopId?: string;
}

export const tenantContext = new AsyncLocalStorage<TenantContextData>();
