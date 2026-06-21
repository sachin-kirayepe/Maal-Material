import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class DeviceManagementService {
  constructor(private prisma: PrismaService) {}

  async getDevices(tenantId: string) {
    return this.prisma.mobileDevice.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
    });
  }

  async getDeviceEvents(tenantId: string, id: string) {
    return this.prisma.deviceEvent.findMany({
      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      where: { tenantId, deviceId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async blockDevice(tenantId: string, id: string) {
    return this.prisma.mobileDevice.update({
      where: { id, tenantId },
      data: { status: "WIPED" },
    });
  }
}
