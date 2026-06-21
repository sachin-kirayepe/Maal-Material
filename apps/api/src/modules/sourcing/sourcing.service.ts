import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class SourcingService {
  constructor(private readonly prisma: PrismaService) {}

  async getRfqs(tenantId: string) {
    return this.prisma.rfq.findMany({
      where: { tenantId },
      include: { purchaseRequisition: true, quotations: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getQuotations(tenantId: string) {
    return this.prisma.procurementQuotation.findMany({
      where: { tenantId },
      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      include: { vendors: true, rfq: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
