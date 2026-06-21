import { Controller, Get, Query } from "@nestjs/common";
import { FleetService } from "./fleet.service";

@Controller("fleet")
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  @Get("operations")
  async getFleetOperations(@Query("tenantId") tenantId: string) {
    return this.fleetService.getFleetOperations(tenantId);
  }

  @Get("analytics")
  async getAnalytics(@Query("tenantId") tenantId: string) {
    return this.fleetService.getAnalytics(tenantId);
  }
}
