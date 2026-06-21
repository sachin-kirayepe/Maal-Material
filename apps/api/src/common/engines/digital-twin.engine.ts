import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * DigitalTwinMirrorEngine — "The Mirror Engine" (Phase 3A)
 *
 * Maintains the live representation (Digital Twin) of physical assets
 * (Vehicles, Sites, Machinery, Warehouses). It processes live
 * telemetry events and mutates the Twin's state so the rest of the
 * system can query a fast, current snapshot of reality.
 */
@Injectable()
export class DigitalTwinEngine {
  private readonly logger = new Logger(DigitalTwinEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Registers a new Physical Asset in the live network.
   */
  async registerPhysicalAsset(
    tenantId: string,
    assetName: string,
    assetType: string,
    serialNumber?: string,
  ) {
    this.logger.log(`Registering Physical Asset [${assetName}] of type [${assetType}]`);
    return this.prisma.physicalAssetNode.create({
      data: {
        tenantId,
        assetName,
        assetType,
        serialNumber,
      },
    });
  }

  /**
   * Processes an incoming telemetry payload and updates the Digital Twin.
   */
  async updateTwinState(tenantId: string, assetNodeId: string, payload: unknown) {
    const updateData: unknown = {
      lastPingAt: new Date(),
    };

    if ((payload as any).lat && (payload as any).lng) {
      (updateData as any).latitude = (payload as any).lat;
      (updateData as any).longitude = (payload as any).lng;
    }

    if ((payload as any).status) (updateData as any).currentState = (payload as any).status;
    if ((payload as any).health) (updateData as any).healthStatus = (payload as any).health;

    // Merge metadata
    const existing = await this.prisma.digitalTwinState.findUnique({
      where: { assetNodeId },
    });

    let currentMetadata = {};
    if (existing && existing!.metadataJson) {
      try {
        currentMetadata = JSON.parse(existing!.metadataJson);
      } catch (e) {}
    }

    (updateData as any).metadataJson = JSON.stringify({ ...currentMetadata, ...(payload as any) });

    const twin = await this.prisma.digitalTwinState.upsert({
      where: { assetNodeId },
      update: updateData as any,
      create: {
        tenantId,
        assetNodeId,
        currentState: (payload as any).status || "IDLE",
        healthStatus: (payload as any).health || "HEALTHY",
        latitude: (payload as any).lat,
        longitude: (payload as any).lng,
        metadataJson: JSON.stringify(payload),
      },
    });

    // If health degraded to CRITICAL, dispatch specific operational event
    if (existing && existing!.healthStatus !== "CRITICAL" && twin.healthStatus === "CRITICAL") {
      this.eventDispatcher.dispatch("operations", "digital_twin_critical", {
        tenantId,
        assetNodeId,
        twinId: twin.id,
      });
    }

    return twin;
  }
}
