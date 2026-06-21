import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import {
  CreateDriverDto,
  UpdateDriverDto,
  UpdateDriverAvailabilityDto,
  DriverQueryDto,
} from "./dto/drivers.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async create(dto: CreateDriverDto) {

                try {
                  // Check unique mobile
      const existingMobile = await this.prisma.driver.findUnique({ where: { mobile: dto.mobile } });
      if (existingMobile)
        throw new ConflictException(`Driver with mobile '${dto.mobile}' already exists`);

      // Check unique license
      const existingLicense = await this.prisma.driver.findUnique({
        where: { licenseNumber: dto.licenseNumber },
      });
      if (existingLicense)
        throw new ConflictException(`Driver with license '${dto.licenseNumber}' already exists`);

      return this.prisma.driver.create({
        data: {
          name: dto.name,
          mobile: dto.mobile,
          email: dto.email,
          licenseNumber: dto.licenseNumber,
          notes: dto.notes,
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'DriversService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async findAll(query: DriverQueryDto = {}) {
    const { search, availabilityStatus, isActive, page, limit } = query as any;
    const take = Math.min(Number(limit) || 20, 100);
    const skip = ((Number(page) || 1) - 1) * take;

    const where: unknown = { deletedAt: null };
    if (availabilityStatus) (where as any).availabilityStatus = availabilityStatus;
    if (isActive !== undefined) (where as any).isActive = isActive;
    if (search) {
      (where as any).OR = [
        { name: { contains: search } },
        { mobile: { contains: search } },
        { licenseNumber: { contains: search } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      this.prisma.driver.findMany({
        where: where as any,
        include: {
          _count: { select: { deliveries: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      this.prisma.driver.count({ where: where as any }),
    ]);

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: take,
        totalPages: Math.ceil(totalItems / take),
        currentPage: Number(page) || 1,
      },
    };
  }

  async findById(id: string) {
    const driver = await this.prisma.driver.findFirst({
      where: { id, deletedAt: null },
      include: {
        deliveries: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            orders: { select: { orderNumber: true, grandTotal: true } },
            customers: { select: { name: true, companyName: true } },
          },
        },
        _count: { select: { deliveries: true } },
      },
    });

    if (!driver) throw new NotFoundException(`Driver '${id}' not found`);
    return driver;
  }

  async update(id: string, dto: UpdateDriverDto) {

                try {
                  await this.findById(id);

      // Check unique constraints if changing
      if (dto.mobile) {
        const existing = await this.prisma.driver.findFirst({
          where: { mobile: dto.mobile, id: { not: id } },
        });
        if (existing) throw new ConflictException(`Mobile '${dto.mobile}' is already in use`);
      }

      if (dto.licenseNumber) {
        const existing = await this.prisma.driver.findFirst({
          where: { licenseNumber: dto.licenseNumber, id: { not: id } },
        });
        if (existing) throw new ConflictException(`License '${dto.licenseNumber}' is already in use`);
      }

      return this.prisma.driver.update({
        where: { id },
        data: dto,
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'DriversService', 
                         action: 'update',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async updateAvailability(id: string, dto: UpdateDriverAvailabilityDto) {

                try {
                  await this.findById(id);
      return this.prisma.driver.update({
        where: { id },
        data: { availabilityStatus: dto.availabilityStatus },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'DriversService', 
                         action: 'updateAvailability',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.driver.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false, availabilityStatus: "INACTIVE" },
    });
    return { success: true, message: `Driver '${id}' removed` };
  }

  async getAvailableDrivers() {
    return this.prisma.driver.findMany({
      where: { deletedAt: null, isActive: true, availabilityStatus: "AVAILABLE" },
      orderBy: { name: "asc" },
    });
  }

  async getDriverDeliveries(id: string) {
    await this.findById(id);
    return this.prisma.delivery.findMany({
      where: { driverId: id, deletedAt: null },
      include: {
        orders: { select: { orderNumber: true, grandTotal: true } },
        customers: { select: { name: true, companyName: true } },
        vehicles: { select: { vehicleNumber: true, type: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Analytics: Driver summary stats
   */
  async getStats() {
    const [totalDrivers, availableDrivers, onDelivery, offDuty] = await Promise.all([
      this.prisma.driver.count({ where: { deletedAt: null, isActive: true } }),
      this.prisma.driver.count({
        where: { deletedAt: null, isActive: true, availabilityStatus: "AVAILABLE" },
      }),
      this.prisma.driver.count({
        where: { deletedAt: null, isActive: true, availabilityStatus: "ON_DELIVERY" },
      }),
      this.prisma.driver.count({
        where: { deletedAt: null, isActive: true, availabilityStatus: "OFF_DUTY" },
      }),
    ]);

    return { totalDrivers, availableDrivers, onDelivery, offDuty };
  }
}
