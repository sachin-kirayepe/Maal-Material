import { AsyncLocalStorage } from "async_hooks";

export interface UowContextData {
  tx?: unknown; // The Prisma Transaction Client
}

export const uowContext = new AsyncLocalStorage<UowContextData>();
