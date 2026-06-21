import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from "@nestjs/common";
import { AutomationService } from "./automation.service";
import { AuthGuard } from "../../common/guards/auth.guard";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("automation")
@UseGuards(AuthGuard, TenantGuard)
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post("workflows")
  createWorkflow(@Request() req: any, @Body() data: unknown) {
    return this.automationService.createWorkflow(req.user!.tenantId, data);
  }

  @Get("workflows")
  getWorkflows(@Request() req: any) {
    return this.automationService.getWorkflows(req.user!.tenantId);
  }

  @Patch("workflows/:id/toggle")
  toggleWorkflow(
    @Request() req: any,
    @Param("id") id: string,
    @Body("isActive") isActive: boolean,
  ) {
    return this.automationService.toggleWorkflow(req.user!.tenantId, id, isActive);
  }

  @Post("workflows/:id/trigger")
  triggerWorkflow(@Request() req: any, @Param("id") id: string, @Body() payload: unknown) {
    return this.automationService.triggerWorkflow(req.user!.tenantId, id, payload);
  }
}
