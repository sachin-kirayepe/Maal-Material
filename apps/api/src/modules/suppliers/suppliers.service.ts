import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreateSupplierDto, UpdateSupplierDto } from "./dto/suppliers.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async create(dto: CreateSupplierDto) {

                try {
                  const existing = await this.prisma.commerceParticipant.findFirst({
        where: { OR: [{ mobile: dto.mobile }, ...(dto.email ? [{ email: dto.email }] : [])] },
      });
      if (existing) throw new ConflictException("Supplier with this mobile or email already exists");

      const { addresses, ...supplierData } = dto;
      return this.prisma.commerceParticipant.create({
        data: {
          ...supplierData,
          // addresses?.length ? { create: addresses } : undefined,
          supplierLedgers: { create: { balance: 0 } },
        },
        include: { supplierLedgers: true },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'SuppliersService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async findAll(query: unknown = {}) {
    const { search, supplierType, isActive, page, limit, sortBy, sortOrder } = query as any;
    const take = Math.min(Number(limit) || 20, 100);
    const skip = ((Number(page) || 1) - 1) * take;

    const where: unknown = { deletedAt: null };
    if (supplierType) (where as any).supplierType = supplierType;
    if (isActive !== undefined) (where as any).isActive = isActive === "true";
    if (search) {
      (where as any).OR = [
        { name: { contains: search } },
        { mobile: { contains: search } },
        { companyName: { contains: search } },
        { gstin: { contains: search } },
      ];
    }

    const orderBy: unknown = {};
    (orderBy as any)[sortBy || "createdAt"] = sortOrder || "desc";

    const [items, totalItems] = await Promise.all([
      this.prisma.commerceParticipant.findMany({
        where: where as any,
        skip,
        take,
        orderBy: orderBy as any,
        include: { _count: { select: { purchaseOrders: true } } },
      }),
      this.prisma.commerceParticipant.count({ where: where as any }),
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
    const supplier = await this.prisma.commerceParticipant.findFirst({
      where: { id, deletedAt: null },
      include: {
        supplierLedgers: true,
        _count: {
          select: { purchaseOrders: true, purchaseInvoices: true, supplierPayments: true },
        },
      },
    });
    if (!supplier) throw new NotFoundException("Supplier not found");
    return supplier;
  }

  async update(id: string, dto: UpdateSupplierDto) {

                try {
                  await this.findById(id);
      return this.prisma.commerceParticipant.update({ where: { id }, data: dto });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'SuppliersService', 
                         action: 'update',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async softDelete(id: string) {

                try {
                  await this.findById(id);
      return this.prisma.commerceParticipant.update({
        where: { id },
        data: { deletedAt: new Date(), isActive: false },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'SuppliersService', 
                         action: 'softDelete',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async getDashboardStats() {
    const [totalSuppliers, activeSuppliers, totalDue] = await Promise.all([
      this.prisma.commerceParticipant.count({ where: { deletedAt: null } }),
      this.prisma.commerceParticipant.count({ where: { deletedAt: null, isActive: true } }),
      this.prisma.supplierLedger.aggregate({ _sum: { balance: true } }),
    ]);
    return { totalSuppliers, activeSuppliers, totalDueToSuppliers: totalDue._sum.balance || 0 };
  }
}
