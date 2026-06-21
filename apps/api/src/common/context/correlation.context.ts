import { AsyncLocalStorage } from "async_hooks";

export interface CorrelationContextData {
  correlationId: string;
}

export const correlationContext = new AsyncLocalStorage<CorrelationContextData>();
