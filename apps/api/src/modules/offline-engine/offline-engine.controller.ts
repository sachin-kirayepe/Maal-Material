import { Controller, Get, Param, Post, Body, UseGuards, Request } from "@nestjs/common";
import { OfflineEngineService } from "./offline-engine.service";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("offline-engine")
@UseGuards(TenantGuard)
export class OfflineEngineController {
  constructor(private readonly offlineEngineService: OfflineEngineService) {}

  @Get("conflicts")
  async getConflicts(@Request() req: unknown) {
    return this.offlineEngineService.getConflicts((req as any).tenantId);
  }

  @Post("conflicts/:id/resolve")
  async resolveConflict(
    @Request() req: unknown,
    @Param("id") id: string,
    @Body("resolutionMethod") resolutionMethod: string,
  ) {
    return this.offlineEngineService.resolveConflict(
      (req as any).tenantId,
      id,
      resolutionMethod,
      (req as any).user?.id || "admin-user",
    );
  }
}
