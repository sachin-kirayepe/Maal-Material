import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class EquipmentAvailabilityService {
  constructor(private prisma: PrismaService) {}

  async getAvailability(tenantId: string, equipmentId: string) {
    return this.prisma.equipmentAvailability.findMany({
      where: { tenantId, equipmentId },
      orderBy: { startDate: "asc" },
    });
  }
}
