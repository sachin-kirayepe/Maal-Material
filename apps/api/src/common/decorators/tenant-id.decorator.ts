import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * @TenantId() param decorator â€” extracts the resolved tenantId from the request
 * Set by TenantMiddleware via x-tenant-id header resolution.
 *
 * Usage:
 *   @Get()
 *   findAll(@TenantId() tenantId: string) { ... }
 */
export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenantId;
  },
);

/**
 * @ShopId() param decorator â€” extracts the resolved shopId from the request
 * Set by TenantMiddleware via x-shop-id header resolution.
 *
 * Usage:
 *   @Get()
 *   findAll(@ShopId() shopId: string) { ... }
 */
export const ShopId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.shopId;
  },
);
