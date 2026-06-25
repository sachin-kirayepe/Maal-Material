import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { TenantGuard } from '@common/guards/tenant.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Controller,
  Post,
  Body,
  Headers,
  HttpStatus,
  Res,
  UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Response } from "express";
import { TelemetryProcessor } from "./telemetry.processor";

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard, TenantGuard)
@Controller("api/v1/iot/webhook")
export class WebhookController {
  constructor(private readonly telemetryProcessor: TelemetryProcessor) {}

  @Post()
  async handleIncomingTelemetry(
    @Headers("x-api-key") apiKey: string,
    @Body() payload: any,
    @Res() res: Response,
  ) {
    if (!apiKey) {
      throw new UnauthorizedException("Missing x-api-key header");
    }

    try {
      // In a real scenario, we'd validate the API key against the IoTDevice table
      // Here, we just queue the raw payload into our unified processor
      await this.telemetryProcessor.queueRawTelemetry("AFTERMARKET_WEBHOOK", payload);

      return res.status(HttpStatus.ACCEPTED).json({ status: "queued" });
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}
