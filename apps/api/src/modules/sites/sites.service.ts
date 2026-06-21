import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { CreateSiteDto, UpdateSiteDto, SiteQueryDto } from "./dto/site.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class SitesService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  private async generateSiteCode(): Promise<string> {
    const count = await this.prisma.projectSite.count({
      where: { siteCode: { startsWith: "SITE-" } },
    });
    return `SITE-${String(count + 1).padStart(5, "0")}`;
  }

  /**
   * Create a new project site
   */
  async create(dto: CreateSiteDto) {

                try {
                  // Verify project exists
      const project = await this.prisma.project.findUnique({ where: { id: dto.projectId } });
      if (!project) throw new NotFoundException(`Project ${dto.projectId} not found`);
      const siteCode = await this.generateSiteCode();

      return this.prisma.projectSite.create({
        data: {
          projectId: dto.projectId,
          name: dto.name,
          siteCode,
          address: dto.address,
          city: dto.city,
          state: dto.state,
          pincode: dto.pincode,
          latitude: dto.latitude,
          longitude: dto.longitude,
          managerId: dto.managerId,
          notes: dto.notes,
        },
        include: {
          projects: { select: { name: true, projectCode: true } },
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'SitesService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * List sites with filtering
   */
  async findAll(query: SiteQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: unknown = { deletedAt: null };
    if (query.projectId) (where as any).projectId = query.projectId;
    if (query.status) (where as any).siteStatus = query.status;
    if (query.search) {
      (where as any).OR = [
        { name: { contains: query.search } },
        { siteCode: { contains: query.search } },
        { city: { contains: query.search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.projectSite.findMany({
        where: where as any,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          projects: { select: { name: true, projectCode: true, projectStatus: true } },
          _count: { select: { siteInventories: true, materialConsumptions: true } },
        },
      }),
      this.prisma.projectSite.count({ where: where as any }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get site by ID with inventory summary
   */
  async findById(id: string) {
    const site = await this.prisma.projectSite.findUnique({
      where: { id },
      include: {
        projects: { select: { name: true, projectCode: true, projectStatus: true } },
        siteInventories: {
          include: {
            products: {
              select: { name: true, sku: true, units: { select: { abbreviation: true } } },
            },
          },
          orderBy: { lastUpdatedAt: "desc" },
        },
        _count: { select: { materialConsumptions: true, projectExpenses: true } },
      },
    });

    if (!site) throw new NotFoundException(`Site ${id} not found`);
    return site;
  }

  /**
   * Update site
   */
  async update(id: string, dto: UpdateSiteDto) {

                try {
                  await this.findById(id);
      return this.prisma.projectSite.update({
        where: { id },
        data: dto,
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'SitesService', 
                         action: 'update',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Soft-delete site
   */
  async remove(id: string) {
    await this.findById(id);
    return this.prisma.projectSite.update({
      where: { id },
      data: { deletedAt: new Date(), siteStatus: "INACTIVE" },
    });
  }
}
