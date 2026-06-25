import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ReleasesService } from "./releases.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("api/v1/releases")
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) {}

  @Get()
  getReleases(@Query("tenantId") tenantId: string) {
    return this.releasesService.getReleases(tenantId || "tenant-1");
  }

  @Post()
  createRelease(@Body() body: { tenantId?: string; version: string; notes: string }) {
    return this.releasesService.createRelease(
      body.tenantId || "tenant-1",
      body.version,
      body.notes,
    );
  }

  @Post(":id/publish")
  publishRelease(@Param("id") id: string, @Body() body: { tenantId?: string }) {
    return this.releasesService.publishRelease(body.tenantId || "tenant-1", id);
  }
}
