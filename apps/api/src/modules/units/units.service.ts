import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreateUnitDto, UpdateUnitDto } from "./dto/units.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class UnitsService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async create(dto: CreateUnitDto) {

                try {
                  const exists = await this.prisma.unit.findUnique({ where: { abbreviation: dto.abbreviation } });
      if (exists)
        throw new ConflictException(`Unit with abbreviation '${dto.abbreviation}' already exists`);
      return this.prisma.unit.create({
        data: {
          name: dto.name,
          abbreviation: dto.abbreviation,
          unitType: dto.unitType || "quantity",
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'UnitsService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async findAll() {
    return this.prisma.unit.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" } });
  }

  async findById(id: string) {
    const unit = await this.prisma.unit.findFirst({ where: { id, deletedAt: null } });
    if (!unit) throw new NotFoundException(`Unit '${id}' not found`);
    return unit;
  }

  async update(id: string, dto: UpdateUnitDto) {

                try {
                  await this.findById(id);
      return this.prisma.unit.update({ where: { id }, data: dto });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'UnitsService', 
                         action: 'update',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.unit.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true, message: `Unit '${id}' removed` };
  }
}
