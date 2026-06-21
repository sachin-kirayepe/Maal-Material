import { Controller, Get, Query } from "@nestjs/common";
import { MonitoringService } from "./monitoring.service";

@Controller("api/v1/monitoring")
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get("metrics")
  getMetrics(@Query("tenantId") tenantId: string) {
    return this.monitoringService.getMetrics(tenantId || "tenant-1");
  }

  @Get("nodes")
  getNodes(@Query("tenantId") tenantId: string) {
    return this.monitoringService.getNodes(tenantId || "tenant-1");
  }
}
