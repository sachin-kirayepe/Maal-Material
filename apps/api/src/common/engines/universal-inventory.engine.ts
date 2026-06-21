import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * UniversalInventoryEngine
 *
 * Reusable enterprise engine for handling stock, material, asset, and capability inventory.
 * Completely decoupled from construction-specific terminology (BOQ, Site, etc.).
 * Can be reused for hardware commerce, paint commerce, or workforce capability mapping.
 */
@Injectable()
export class UniversalInventoryEngine {
  private readonly logger = new Logger(UniversalInventoryEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Universal consumption logic (can replace ConstructionMaterialConsumption)
   */
  async consumeInventory(params: {
    tenantId: string;
    productId: string;
    quantity: number;
    referenceContextId: string; // Could be a projectId, workOrderId, or generic entity
    consumedBy: string;
  }) {
    this.logger.log(`Executing universal inventory consumption for product ${params.productId}`);

    // Update actual inventory stock (assuming Stock model exists and is handled via Sagss or Prisma Proxy)
    // Here we record the domain-agnostic consumption log which internally maps to the old 'construction_material_consumption' table

    // Note: To preserve existing databases, we use the renamed generic Prisma accessors:
    const consumption = await this.prisma.inventoryConsumption.create({
      data: {
        tenantId: params.tenantId,
        productId: params.productId,
        productName: "RESOLVED_PRODUCT_NAME", // Would fetch from product registry
        quantityConsumed: params.quantity,
        unit: "UNITS",
        dateConsumed: new Date(),
        consumedBy: params.consumedBy,
        projectId: params.referenceContextId, // Using legacy field for mapping
      },
    });

    // Dispatch a universal event
    this.eventDispatcher.dispatch("inventory", "consumed", {
      consumptionId: consumption.id,
      productId: params.productId,
      quantity: params.quantity,
    });

    return consumption;
  }
}
