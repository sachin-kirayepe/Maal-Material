import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreateShippingZoneDto, UpdateShippingZoneDto } from "./dto/shipping.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class ShippingService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async create(dto: CreateShippingZoneDto) {

                try {
                  const existing = await this.prisma.shippingZone.findUnique({ where: { code: dto.code } });
      if (existing) throw new ConflictException(`Shipping zone code '${dto.code}' already exists`);

      return this.prisma.shippingZone.create({
        data: {
          name: dto.name,
          code: dto.code,
          cities: dto.cities,
          state: dto.state,
          baseCost: dto.baseCost || 0,
          perKmCost: dto.perKmCost || 0,
          estimatedDays: dto.estimatedDays || 1,
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ShippingService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.shippingZone.findMany({
        where: { deletedAt: null },
        include: {
          _count: { select: { deliveries: true } },
        },
        orderBy: { name: "asc" },
        skip,
        take: limit,
      }),
      this.prisma.shippingZone.count({ where: { deletedAt: null } })
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

  async findById(id: string) {
    const zone = await this.prisma.shippingZone.findFirst({
      where: { id, deletedAt: null },
      include: {
        _count: { select: { deliveries: true } },
      },
    });

    if (!zone) throw new NotFoundException(`Shipping zone '${id}' not found`);
    return zone;
  }

  async update(id: string, dto: UpdateShippingZoneDto) {

                try {
                  await this.findById(id);
      return this.prisma.shippingZone.update({
        where: { id },
        data: dto,
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ShippingService', 
                         action: 'update',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.shippingZone.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { success: true, message: `Shipping zone '${id}' removed` };
  }

  /**
   * Calculate estimated shipping cost for a zone + weight
   */
  async calculateCost(zoneId: string, _weightKg: number, distanceKm: number = 0) {
    const zone = await this.findById(zoneId);
    const cost = zone.baseCost + zone.perKmCost * distanceKm;
    return {
      zoneId: zone.id,
      zoneName: zone.name,
      baseCost: zone.baseCost,
      distanceCost: zone.perKmCost * distanceKm,
      totalCost: cost,
      estimatedDays: zone.estimatedDays,
    };
  }
}
