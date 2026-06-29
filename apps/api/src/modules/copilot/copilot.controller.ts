import { Controller, Get, Post, Body, Param, UseGuards, Request } from "@nestjs/common";
import { CopilotService } from "./copilot.service";
import { AuthGuard } from "../../common/guards/auth.guard";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("copilot")
@UseGuards(AuthGuard, TenantGuard)
export class CopilotController {
  constructor(private readonly copilotService: CopilotService) {}

  @Get("conversations")
  getConversations(@Request() req: any) {
    return this.copilotService.getConversations(req.tenantId, req.user!.sub);
  }

  @Get("conversations/:id")
  getConversation(@Request() req: any, @Param("id") id: string) {
    return this.copilotService.getConversation(req.tenantId, id);
  }

  @Post("conversations/message")
  sendMessage(
    @Request() req: any,
    @Body("conversationId") conversationId: string,
    @Body("message") message: string,
  ) {
    return this.copilotService.sendMessage(req.tenantId, req.user!.sub, conversationId, message);
  }

  @Post("action")
  executeAction(
    @Request() req: any,
    @Body("actionId") actionId: string,
    @Body("messageId") messageId: string,
  ) {
    return this.copilotService.executeAction(req.tenantId, req.user!.sub, actionId, messageId);
  }
}
