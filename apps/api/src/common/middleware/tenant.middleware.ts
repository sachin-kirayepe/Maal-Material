import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PrismaService } from "@database/prisma.service";
import { tenantContext } from "../context/tenant.context";

export interface TenantRequest extends Request {
  tenantId?: string;
  shopId?: string;
  tenantStatus?: string;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: TenantRequest, _res: Response, next: NextFunction) {
    const tenantId = req.headers["x-tenant-id"] as string;
    const shopId = req.headers["x-shop-id"] as string;

    // Certain routes (like public marketplace, health, or auth) bypass tenant resolution
    if (this.isPublicRoute(req.originalUrl)) {
      // Still attach tenant context if provided (for optional enrichment)
      if (tenantId) {
        req.tenantId = tenantId;
      }
      return next();
    }

    if (!tenantId) {
      return next();
    }

    // Verify tenant exists, is active, and not soft-deleted
    const tenant = await this.prisma.tenant!.findFirst({
      where: {
        id: tenantId,
        deletedAt: null,
      },
    });

    if (!tenant) {
      throw new UnauthorizedException("Invalid tenant ID or tenant has been removed");
    }

    if (tenant!.status !== "ACTIVE") {
      throw new UnauthorizedException(
        `Tenant account is ${tenant!.status.toLowerCase()}. Contact platform support.`,
      );
    }

    req.tenantId = tenantId;
    req.tenantStatus = tenant!.status;

    // Optional: Resolve shop context if provided
    if (shopId) {
      const shop = await this.prisma.shop.findFirst({
        where: {
          id: shopId,
          tenantId,
          deletedAt: null,
        },
      });
      if (!shop) {
        throw new UnauthorizedException("Shop does not exist or does not belong to this tenant");
      }
      if (shop.operationalStatus === "SUSPENDED") {
        throw new UnauthorizedException("Shop has been suspended");
      }
      req.shopId = shopId;
    }

    tenantContext.run({ tenantId: req.tenantId, shopId: req.shopId }, () => {
      next();
    });
  }

  private isPublicRoute(url: string): boolean {
    const publicPaths = [
      "/api/v1/health",
      "/api/v1/auth/login",
      "/api/v1/auth/register",
      "/api/v1/auth/refresh",
      "/api/v1/marketplace/listings",
      "/api/v1/marketplace/categories",
    ];
    return publicPaths.some((path) => url.startsWith(path));
  }
}
