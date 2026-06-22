import { Controller, Post, Body, Res, HttpStatus } from "@nestjs/common";
import { NetworkResilienceService } from "./network-resilience.service";
import type { Response } from "express";

@Controller("api/v1/network-resilience")
export class NetworkResilienceController {
  constructor(private readonly resilienceService: NetworkResilienceService) {}

  @Post("telemetry")
  async logTelemetry(@Body() body: unknown, @Res() res: Response) {
    try {
      const { tenantId, deviceId, connectionType, effectiveType, downlinkSpeed, rttLatency } =
        body as any;

      if (!tenantId || !deviceId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "tenantId and deviceId are required.",
        });
      }

      const telemetry = await this.resilienceService.logNetworkTelemetry(
        tenantId,
        deviceId,
        connectionType,
        effectiveType,
        downlinkSpeed,
        rttLatency,
      );

      return res.status(HttpStatus.CREATED).json({
        status: "success",
        data: telemetry,
      });
    } catch (error: unknown) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: (error as any).message || "Error logging telemetry",
      });
    }
  }
}
