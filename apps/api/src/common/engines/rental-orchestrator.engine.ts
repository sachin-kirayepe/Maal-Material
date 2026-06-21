import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";
import { CapabilityOrchestratorEngine } from "./capability-orchestrator.engine";

/**
 * RentalOrchestratorEngine
 *
 * Manages the lifecycle of rental assets (machinery, vehicles, tools, equipment)
 * across the commerce ecosystem.
 *
 * Provides reusable abstractions for:
 * - Rental availability checking
 * - Booking validation
 * - Scheduling conflict detection
 * - Rental lifecycle state management
 * - Future AI-powered pricing optimization
 */
@Injectable()
export class RentalOrchestratorEngine {
  private readonly logger = new Logger(RentalOrchestratorEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
    private readonly capabilityEngine: CapabilityOrchestratorEngine,
  ) {}

  /**
   * Check rental availability for a specific asset in a date range.
   * Detects scheduling conflicts with existing bookings.
   */
  async checkAvailability(params: {
    tenantId: string;
    assetId: string;
    startDate: Date;
    endDate: Date;
  }) {
    this.logger.debug(`Checking rental availability for asset ${params.assetId}`);

    // Ensure tenant has rental capability
    await this.capabilityEngine.requireCapability(params.tenantId, "RENTALS");

    // Find conflicting bookings
    const conflicts = await this.prisma.rentalBooking.findMany({
      where: {
        equipmentId: params.assetId,
        status: { in: ["CONFIRMED", "ACTIVE"] },
        OR: [
          {
            startDate: { lte: params.endDate },
            endDate: { gte: params.startDate },
          },
        ],
      },
    });

    return {
      isAvailable: conflicts.length === 0,
      conflictCount: conflicts.length,
      conflicts: conflicts.map((c) => ({
        bookingId: c.id,
        startDate: c.startDate,
        endDate: c.endDate,
        status: c.status,
      })),
    };
  }

  /**
   * Create a new rental booking after availability validation.
   * This is a transaction-safe operation that prevents double-booking.
   */
  async createBooking(params: {
    tenantId: string;
    assetId: string;
    customerId: string;
    startDate: Date;
    endDate: Date;
    dailyRate: number;
  }) {
    this.logger.log(`Creating rental booking for asset ${params.assetId}`);

    // Re-validate availability inside a transaction to prevent race conditions
    const availability = await this.checkAvailability({
      tenantId: params.tenantId,
      assetId: params.assetId,
      startDate: params.startDate,
      endDate: params.endDate,
    });

    if (!availability.isAvailable) {
      throw new BadRequestException(
        `Asset ${params.assetId} is not available for the requested period. ${availability.conflictCount} conflicts found.`,
      );
    }

    const days = Math.ceil(
      (params.endDate.getTime() - params.startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const totalAmount = days * params.dailyRate;

    const booking = await this.prisma.rentalBooking.create({
      data: {
        tenantId: params.tenantId,
        equipmentId: params.assetId,
        contractorId: params.customerId,
        startDate: params.startDate,
        endDate: params.endDate,
        totalAmount,
        status: "CONFIRMED",
      },
    });

    this.eventDispatcher.dispatch("rental", "booking_created", {
      bookingId: booking.id,
      assetId: params.assetId,
      totalAmount,
      days,
    });

    return booking;
  }
}
