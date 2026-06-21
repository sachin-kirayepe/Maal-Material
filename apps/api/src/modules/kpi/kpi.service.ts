import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { OnEvent } from "@nestjs/event-emitter";
import { DomainEvents } from "../events/dto/events.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class KpiService {
  private readonly logger = new Logger(KpiService.name);

  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  /**
   * Listen to Invoice Created event to bump Monthly Revenue KPI instantly
   */
  @OnEvent(DomainEvents.INVOICE_CREATED, { async: true })
  async handleInvoiceCreated(payload: unknown) {

                try {
                  if (!(payload as any).totalAmount) return;

      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      try {
        await this.prisma.kpi.upsert({
          where: {
            id: "temp-upsert-will-use-composite-later", // Fallback to raw query if needed
          },
          create: {
            tenantId: (payload as any).tenantId,
            name: "MONTHLY_REVENUE",
            category: "FINANCIAL",
            value: (payload as any).totalAmount,
            unit: "USD",
            periodStart,
            periodEnd,
          },
          update: {
            value: { increment: (payload as any).totalAmount },
          },
        });
      } catch (error) {
        // Upsert by non-unique fields isn't native Prisma without @@unique
        // We will do findFirst then update/create
        const existing = await this.prisma.kpi.findFirst({
          where: {
            name: "MONTHLY_REVENUE",
            periodStart,
            periodEnd,
            tenantId: (payload as any).tenantId,
          },
        });

        if (existing) {
          await this.prisma.kpi.update({
            where: { id: existing!.id },
            data: { value: { increment: (payload as any).totalAmount } },
          });
        } else {
          await this.prisma.kpi.create({
            data: {
              tenantId: (payload as any).tenantId,
              name: "MONTHLY_REVENUE",
              category: "FINANCIAL",
              value: (payload as any).totalAmount,
              unit: "USD",
              periodStart,
              periodEnd,
            },
          });
        }
      }
      this.logger.log(`Updated MONTHLY_REVENUE KPI for tenant ${(payload as any).tenantId}`);
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'KpiService', 
                         action: 'handleInvoiceCreated',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async getKpis(tenantId?: string) {
    return this.prisma.kpi.findMany({
      where: {
        ...(tenantId && { tenantId }),
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
