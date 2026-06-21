import { Controller, Get, Post, Param, Body, Query } from "@nestjs/common";
import { DeploymentsService } from "./deployments.service";

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
