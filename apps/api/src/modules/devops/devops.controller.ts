import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { DevopsService } from "./devops.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("api/v1/devops")
export class DevopsController {
  constructor(private readonly devopsService: DevopsService) {}

  @Get("pipelines")
  getPipelines(@Query("tenantId") tenantId: string) {
    return this.devopsService.getPipelines(tenantId || "tenant-1");
  }

  @Post("pipelines/trigger")
  triggerPipeline(@Body() body: { tenantId?: string; pipelineName: string; branch: string }) {
    return this.devopsService.triggerPipeline(
      body.tenantId || "tenant-1",
      body.pipelineName,
      body.branch,
    );
  }

  @Get("environments")
  getConfigs(@Query("tenantId") tenantId: string) {
    return this.devopsService.getEnvironmentConfigs(tenantId || "tenant-1");
  }
}
