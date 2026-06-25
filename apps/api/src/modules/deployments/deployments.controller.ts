import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { DeploymentsService } from "./deployments.service";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("api/v1/deployments")
export class DeploymentsController {
  constructor(private readonly deploymentsService: DeploymentsService) {}

  @Get()
  findAll(@Query("tenantId") tenantId: string) {
    return this.deploymentsService.findAll(tenantId || "tenant-1");
  }

  @Post()
  trigger(
    @Body() body: { tenantId?: string; version: string; environment: string; initiatorId: string },
  ) {
    return this.deploymentsService.triggerDeployment(
      body.tenantId || "tenant-1",
      body.version,
      body.environment,
      body.initiatorId,
    );
  }

  @Post(":id/rollback")
  rollback(@Param("id") id: string, @Body() body: { tenantId?: string }) {
    return this.deploymentsService.rollbackDeployment(body.tenantId || "tenant-1", id);
  }
}
