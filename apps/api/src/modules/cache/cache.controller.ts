import { Controller, Get, Post, Param, UseGuards, Request } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("cache")
@UseGuards(TenantGuard)
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Get("entries")
  async getEntries(@Request() req: unknown) {
    return this.cacheService.getEntries((req as any).tenantId);
  }

  @Post("invalidate/:key")
  async invalidateKey(@Param("key") key: string, @Request() req: unknown) {
    await this.cacheService.invalidateKey((req as any).tenantId, key);
    return { success: true };
  }
}
