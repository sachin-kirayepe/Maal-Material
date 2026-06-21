import { Controller, Get, Post, Param, UseGuards, Request } from "@nestjs/common";
import { DistributedService } from "./distributed.service";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("distributed")
@UseGuards(TenantGuard)
export class DistributedController {
  constructor(private readonly distributedService: DistributedService) {}

  @Get("tasks")
  async getTasks(@Request() req: unknown) {
    return this.distributedService.getTasks((req as any).tenantId);
  }

  @Post("tasks/:id/retry")
  async retryTask(@Param("id") taskId: string, @Request() req: unknown) {
    await this.distributedService.retryTask((req as any).tenantId, taskId);
    return { success: true };
  }
}
