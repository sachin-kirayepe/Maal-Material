import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { FraudDetectionService } from "../fraud-detection/fraud-detection.service";

@Injectable()
export class TelemetryProcessor {
  private readonly logger = new Logger(TelemetryProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fraudDetectionService: FraudDetectionService,
  ) {}

  /**
   * Simulates queuing data into Redis/BullMQ.
   * In a real app, this would use @InjectQueue() and add to queue.
   */
  async queueRawTelemetry(providerType: string, payload: any) {
    this.logger.log(`Queued telemetry from ${providerType}`);
    // Simulate async processing
    setTimeout(() => this.processTelemetry(providerType, payload), 100);
  }

  /**
   * This would typically be a @Process() method in a BullMQ consumer.
   */
  async processTelemetry(providerType: string, payload: any) {
    try {
      // 1. Standardize data based on provider
      const standardized = this.standardizePayload(providerType, payload);
      if (!standardized.deviceId) {
        this.logger.warn("Skipping payload without deviceId");
        return;
      }

      // 2. Look up the IoT Device and linked Equipment
      const device = await this.prisma.ioTDevice.findUnique({
        where: { deviceId: standardized.deviceId },
      });

      if (!device || !device.isActive) {
        this.logger.warn(`Device ${standardized.deviceId} not found or inactive`);
        return;
      }

      // 3. Save Telemetry Log
      const log = await this.prisma.telemetryLog.create({
        data: {
          equipmentId: device.equipmentId,
          deviceId: device.deviceId,
          fuelLevel: standardized.fuelLevel,
          engineStatus: standardized.engineStatus,
          latitude: standardized.latitude,
          longitude: standardized.longitude,
          rawData: JSON.stringify(payload),
        },
      });

      // 4. Trigger Fraud Detection Logic
      await this.fraudDetectionService.evaluateFuelAnomaly(device.equipmentId, log);
    } catch (error: any) {
      this.logger.error(`Error processing telemetry: ${error.message}`);
    }
  }

  private standardizePayload(providerType: string, payload: any) {
    // Basic normalization mapping depending on source
    switch (providerType) {
      case "OEM_API":
        // e.g., Caterpillar format
        return {
          deviceId: payload.MachineSerialNumber,
          fuelLevel: payload.FuelRemainingLiters,
          engineStatus: payload.EngineRunning ? "ON" : "OFF",
          latitude: payload.Location?.Lat,
          longitude: payload.Location?.Lng,
        };
      case "AFTERMARKET_WEBHOOK":
        // e.g., Third-party IoT sensor JSON
        return {
          deviceId: payload.mac_address,
          fuelLevel: payload.sensors?.fuel_liters,
          engineStatus: payload.sensors?.ignition ? "ON" : "OFF",
          latitude: payload.gps?.lat,
          longitude: payload.gps?.lon,
        };
      default:
        return {};
    }
  }
}
