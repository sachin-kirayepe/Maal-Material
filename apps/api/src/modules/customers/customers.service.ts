import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { Prisma } from "@prisma/client";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async create(createCustomerDto: CreateCustomerDto) {

                try {
                  const existing = await this.prisma.customer.findUnique({
        where: { mobile: createCustomerDto.mobile },
      });

      if (existing) {
        throw new ConflictException("Customer with this mobile number already exists");
      }

      const { type, ...rest } = createCustomerDto as any;
      const dataToSave = { ...rest, ...(type && { customerType: type }) };

      return this.prisma.customer.create({
        data: dataToSave,
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'CustomersService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async findAll(params: { skip?: number; take?: number; search?: string; type?: string }) {
    const { skip = 0, take = 10, search, type } = params;

    const where: Prisma.CustomerWhereInput = {
      deletedAt: null,
      ...(type && { customerType: type }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { mobile: { contains: search } },
          { companyName: { contains: search } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip: isNaN(Number(skip)) ? 0 : Number(skip),
        take: isNaN(Number(take)) ? 10 : Number(take),
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.customer.count({ where }),
    ]);

    console.log('Customer Service findAll: where=', JSON.stringify(where), 'items count=', items.length);

    return {
      items,
      meta: {
        total,
        page: Math.floor(skip / take) + 1,
        lastPage: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, deletedAt: null },
      include: {
        // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
        addresses: true,
        invoices: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
        payments: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {

                try {
                  await this.findOne(id); // Ensure exists

      return this.prisma.customer.update({
        where: { id },
        data: updateCustomerDto,
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'CustomersService', 
                         action: 'update',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists

    return this.prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}
