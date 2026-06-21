import { Injectable, Logger } from "@nestjs/common";
import { TelemetryProcessor } from "./telemetry.processor";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class OemPollingService {
  private readonly logger = new Logger(OemPollingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly telemetryProcessor: TelemetryProcessor,
  ) {}

  //
  // In a real NestJS app, this would be scheduled using @Cron('0 */5 * * * *')
  // to run every 5 minutes and fetch data from external OEM APIs.
  //
  async pollOemMachines() {
    this.logger.log("Starting OEM API Polling job");

    try {
      // Find all active OEM IoT Devices
      const devices = await this.prisma.ioTDevice.findMany({
        where: { providerType: "OEM_API", isActive: true },
      });

      for (const device of devices) {
        // Simulate an HTTP call to Caterpillar or Volvo API
        const mockOemResponse = {
          MachineSerialNumber: device.deviceId,
          FuelRemainingLiters: Math.random() * 200,
          EngineRunning: false,
          Location: { Lat: 28.7041, Lng: 77.1025 },
        };

        // Queue the raw data into our unified processor
        await this.telemetryProcessor.queueRawTelemetry("OEM_API", mockOemResponse);
      }
    } catch (error: any) {
      this.logger.error(`Failed to poll OEM APIs: ${error.message}`);
    }
  }
}
