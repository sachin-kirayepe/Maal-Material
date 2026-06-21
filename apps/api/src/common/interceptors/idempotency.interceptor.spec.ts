import { ExecutionContext, CallHandler, HttpException } from "@nestjs/common";
import { IdempotencyInterceptor } from "./idempotency.interceptor";
import { of, firstValueFrom } from "rxjs";

describe("IdempotencyInterceptor - Enterprise Resiliency", () => {
  let interceptor: IdempotencyInterceptor;
  let mockContext: any;
  let mockHandler: Partial<CallHandler>;
  let mockRedis: any;

  beforeEach(() => {
    mockRedis = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue('OK'),
    };

    interceptor = new IdempotencyInterceptor(mockRedis as any);
    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: "POST",
          headers: {
            "idempotency-key": "unique-uuid-123",
          },
          url: "/api/v1/payments",
          tenantId: "t1"
        }),
      }),
    };
    mockHandler = {
      handle: jest.fn().mockReturnValue(of({ success: true, transactionId: "txn_999" })),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should bypass GET requests", async () => {
    mockContext.switchToHttp().getRequest.mockReturnValue({ method: "GET", headers: {} });

    const result = await firstValueFrom(await interceptor.intercept(mockContext as ExecutionContext, mockHandler as CallHandler));
    
    expect(result).toEqual({ success: true, transactionId: "txn_999" });
    const request = mockContext.switchToHttp().getRequest();
    expect(request.headers).toEqual({});
  });

  it("should process POST request and cache the result if key is new", async () => {
    const result = await firstValueFrom(await interceptor.intercept(mockContext as ExecutionContext, mockHandler as CallHandler));
    
    expect(result).toEqual({ success: true, transactionId: "txn_999" });
    expect(mockHandler.handle).toHaveBeenCalledTimes(1);
  });

  it("should block a duplicate POST request with the same Idempotency-Key and return cached response", async () => {
    await firstValueFrom(await interceptor.intercept(mockContext as ExecutionContext, mockHandler as CallHandler));
    
    mockRedis.get.mockResolvedValueOnce(JSON.stringify({ success: true, cached: true }));

    const duplicateResult = await firstValueFrom(await interceptor.intercept(mockContext as ExecutionContext, mockHandler as CallHandler));
    
    expect(duplicateResult).toEqual({ success: true, cached: true });
    expect(mockHandler.handle).toHaveBeenCalledTimes(1);
  });

  it("should block a duplicate POST request if currently processing", async () => {
    mockRedis.get.mockResolvedValueOnce("PROCESSING");

    let error: any;
    try {
      await firstValueFrom(await interceptor.intercept(mockContext as ExecutionContext, mockHandler as CallHandler));
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(HttpException);
    expect(error.getStatus()).toBe(409); // Conflict
  });
});
