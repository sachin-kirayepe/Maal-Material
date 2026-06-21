import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreateWarehouseDto, UpdateWarehouseDto } from "./dto/warehouses.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async create(dto: CreateWarehouseDto) {

                try {
                  const exists = await this.prisma.warehouse.findUnique({ where: { code: dto.code } });
      if (exists) throw new ConflictException(`Warehouse code '${dto.code}' already exists`);
      return this.prisma.warehouse.create({
        data: {
          name: dto.name,
          code: dto.code,
          address: dto.address,
          city: dto.city,
          state: dto.state,
          pincode: dto.pincode,
          phone: dto.phone,
          isPrimary: dto.isPrimary ?? false,
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'WarehousesService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async findAll() {
    return this.prisma.warehouse.findMany({
      where: { deletedAt: null },
      include: { _count: { select: {} } },
      orderBy: { createdAt: "asc" },
    });
  }

  async findById(id: string) {
    const wh = await this.prisma.warehouse.findFirst({
      where: { id, deletedAt: null },
      include: {
        warehouseStocks: {
          include: { products: { include: { units: true } } },
        },
        _count: { select: {} },
      },
    });
    if (!wh) throw new NotFoundException(`Warehouse '${id}' not found`);
    return wh;
  }

  async update(id: string, dto: UpdateWarehouseDto) {

                try {
                  await this.findById(id);
      return this.prisma.warehouse.update({ where: { id }, data: dto });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'WarehousesService', 
                         action: 'update',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.warehouse.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { success: true, message: `Warehouse '${id}' removed` };
  }
}
