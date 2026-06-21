import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { FieldOperationsService } from "./field-operations.service";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("field-operations")
@UseGuards(TenantGuard)
export class FieldOperationsController {
  constructor(private readonly fieldOpsService: FieldOperationsService) {}

  @Get("tasks")
  async getTasks(@Request() req: unknown) {
    return this.fieldOpsService.getTasks((req as any).tenantId);
  }

  @Get("sessions")
  async getSessions(@Request() req: unknown) {
    return this.fieldOpsService.getSessions((req as any).tenantId);
  }
}
