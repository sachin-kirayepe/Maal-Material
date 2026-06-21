import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class FraudDetectionService {
  private readonly logger = new Logger(FraudDetectionService.name);

  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async getFraudSignals(tenantId: string) {
    this.logger.log(`Fetching fraud signals for ${tenantId}`);
    return this.prisma.fraudSignal.findMany({
      where: { tenantId },
      orderBy: { detectedAt: "desc" },
      take: 100,
    });
  }

  async updateSignalStatus(tenantId: string, id: string, status: string) {

                try {
                  return this.prisma.fraudSignal.update({
        where: { id, tenantId },
        data: {
          status,
          resolvedAt: status === "RESOLVED" || status === "FALSE_POSITIVE" ? new Date() : null,
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'FraudDetectionService', 
                         action: 'updateSignalStatus',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async evaluateFuelAnomaly(equipmentId: string, currentLog: any) {
    // Basic theft detection logic:
    // If the engine is OFF and fuel has dropped significantly since the last reading, raise an alarm.

    // 1. Get the previous telemetry log for this equipment
    const previousLog = await this.prisma.telemetryLog.findFirst({
      where: {
        equipmentId,
        timestamp: { lt: currentLog.timestamp },
      },
      orderBy: { timestamp: "desc" },
    });

    if (!previousLog || previousLog.fuelLevel == null || currentLog.fuelLevel == null) {
      return; // Not enough data
    }

    const fuelDrop = previousLog.fuelLevel - currentLog.fuelLevel;

    // 2. Rule: If engine is OFF and fuel dropped by > 5 liters
    if (currentLog.engineStatus === "OFF" && fuelDrop > 5) {
      this.logger.warn(
        `CRITICAL: Fuel siphon detected on equipment ${equipmentId}! Dropped by ${fuelDrop}L while OFF.`,
      );

      // 3. Create Fraud Signal
      const signal = await this.prisma.fraudSignal.create({
        data: {
          tenantId: "SYSTEM", // Assuming system-level tenant for hardware alerts
          entityId: equipmentId,
          signalType: "FUEL_SIPHONING",
          severity: "CRITICAL",
          description: `Detected unauthorized fuel drop of ${fuelDrop.toFixed(2)}L while engine was OFF.`,
          contextData: JSON.stringify({ previousLog: previousLog.id, currentLog: currentLog.id }),
        },
      });

      // 4. Log the Theft Event
      await this.prisma.fuelTheftEvent.create({
        data: {
          equipmentId,
          fraudSignalId: signal.id,
          fuelLostLiters: fuelDrop,
          engineStatusAt: currentLog.engineStatus,
        },
      });

      // (Optional Action) Suspend current operator assignment
      // await this.prisma.operatorAssignment.updateMany({ ... status: 'SUSPENDED' })
    }
  }
}
