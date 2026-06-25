import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class RentalsService {
  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async getBookings(tenantId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const whereClause = { tenantId };

    const [items, total] = await Promise.all([
      this.prisma.rentalBooking.findMany({
        where: whereClause,
        include: { equipment: true },
        skip,
        take: limit,
      }),
      this.prisma.rentalBooking.count({ where: whereClause })
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async createBookingIntent(data: {
    tenantId: string;
    equipmentId: string;
    contractorId: string;
    startDate: Date;
    endDate: Date;
    totalAmount: number;
  }) {

                try {
                  // 1. Verify availability before creating intent
      const overlaps = await this.prisma.equipmentAvailability.findMany({
        where: {
          tenantId: data.tenantId,
          equipmentId: data.equipmentId,
          OR: [{ startDate: { lte: data.endDate }, endDate: { gte: data.startDate } }],
        },
      });

      if (overlaps.length > 0) {
        throw new BadRequestException("Equipment is not available for the selected dates");
      }

      // 2. Create Intent
      return this.prisma.rentalBooking.create({
        data: {
          tenantId: data.tenantId,
          equipmentId: data.equipmentId,
          contractorId: data.contractorId,
          startDate: data.startDate,
          endDate: data.endDate,
          totalAmount: data.totalAmount,
          status: "REQUESTED", // Intent-based Approval Workflow
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'RentalsService', 
                         action: 'createBookingIntent',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async approveBooking(bookingId: string) {

                try {
                  const booking = await this.prisma.rentalBooking.findUnique({ where: { id: bookingId } });
      if (!booking) throw new BadRequestException("Booking not found");

      await this.prisma.$transaction(async (tx) => {
        // Pessimistic Lock on the Equipment to prevent concurrent approvals
        await tx.$executeRaw`SELECT id FROM "Equipment" WHERE id = ${booking.equipmentId} FOR UPDATE`;

        // Re-check overlaps inside the locked transaction
        const overlaps = await tx.equipmentAvailability.findMany({
          where: {
            tenantId: booking.tenantId,
            equipmentId: booking.equipmentId,
            OR: [{ startDate: { lte: booking.endDate }, endDate: { gte: booking.startDate } }],
          },
        });

        if (overlaps.length > 0) {
          throw new BadRequestException("Equipment is already booked for these dates");
        }

        await tx.equipmentAvailability.create({
          data: {
            tenantId: booking.tenantId,
            equipmentId: booking.equipmentId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            status: "BLOCKED",
            reason: "BOOKED",
          },
        });

        await tx.rentalBooking.update({
          where: { id: bookingId },
          data: { status: "APPROVED" },
        });
      });

      return { message: "Booking Approved and Calendar Locked" };
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'RentalsService', 
                         action: 'approveBooking',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }
}
