import { Controller, Get, Post, Body, UseGuards, Request } from "@nestjs/common";
import { AiService } from "./ai.service";
import { AuthGuard } from "../../common/guards/auth.guard";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("ai")
@UseGuards(AuthGuard, TenantGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get("action-logs")
  getActionLogs(@Request() req: any) {
    return this.aiService.getAiActionLogs(req.user!.tenantId);
  }

  @Get("context")
  getBusinessContext(@Request() req: any) {
    return this.aiService.getBusinessContext(req.user!.tenantId);
  }

  @Post("command")
  dispatchCommand(
    @Request() req: any,
    @Body("command") command: string,
    @Body("payload") payload: unknown,
  ) {
    return this.aiService.dispatchCommand(req.user!.tenantId, command, payload);
  }
}
