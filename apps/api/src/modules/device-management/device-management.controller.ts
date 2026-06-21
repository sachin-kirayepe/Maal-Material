import { Controller, Get, Param, Post, UseGuards, Request } from "@nestjs/common";
import { DeviceManagementService } from "./device-management.service";
import { TenantGuard } from "../../common/guards/tenant.guard";

@Controller("device-management")
@UseGuards(TenantGuard)
export class DeviceManagementController {
  constructor(private readonly deviceManagementService: DeviceManagementService) {}

  @Get("devices")
  async getDevices(@Request() req: unknown) {
    return this.deviceManagementService.getDevices((req as any).tenantId);
  }

  @Get("devices/:id/events")
  async getDeviceEvents(@Request() req: unknown, @Param("id") id: string) {
    return this.deviceManagementService.getDeviceEvents((req as any).tenantId, id);
  }

  @Post("devices/:id/block")
  async blockDevice(@Request() req: unknown, @Param("id") id: string) {
    return this.deviceManagementService.blockDevice((req as any).tenantId, id);
  }
}
