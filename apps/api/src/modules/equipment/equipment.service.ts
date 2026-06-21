import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class EquipmentService {
  constructor(private prisma: PrismaService) {}

  async getEquipment(tenantId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const whereClause = { tenantId };

    const [items, total] = await Promise.all([
      this.prisma.equipmentAsset.findMany({
        where: whereClause,
        include: { pricing: true, availability: true },
        skip,
        take: limit,
      }),
      this.prisma.equipmentAsset.count({ where: whereClause })
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

  async getAvailableEquipment(tenantId: string, startDate: Date, endDate: Date) {
    // Advanced filtering to ensure no overlapping blocks
    return this.prisma.equipmentAsset.findMany({
      where: {
        tenantId,
        status: "AVAILABLE",
        availability: {
          none: {
            OR: [{ startDate: { lte: endDate }, endDate: { gte: startDate } }],
          },
        },
      },
      include: { pricing: true },
    });
  }

  async verifyGatePass(equipmentId: string) {
    // When the RFID scanner at the gate reads an equipment tag,
    // it checks if there's an active deployment for it.

    const activeDeployment = await this.prisma.equipmentDeployment.findFirst({
      where: {
        equipmentId,
        status: "PENDING", // PENDING means it has an open ticket to dispatch
        // Ideally we check date matching as well
      },
    });

    if (!activeDeployment) {
      return { status: "BLOCKED", reason: "No active deployment pass found for this equipment." };
    }

    // Update status to IN_TRANSIT
    await this.prisma.equipmentDeployment.update({
      where: { id: activeDeployment.id },
      data: { status: "IN_TRANSIT", dispatchDate: new Date() },
    });

    return { status: "ALLOWED", message: "Gate pass verified. Boom barrier open." };
  }
}
