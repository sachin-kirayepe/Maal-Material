import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import {
  CreateProjectDto,
  UpdateProjectDto,
  CreatePhaseDto,
  ProjectQueryDto,
} from "./dto/project.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  /**
   * Generate a unique project code: PRJ-YYYYMMDD-XXXX
   */
  private async generateProjectCode(): Promise<string> {
    const date = new Date();
    const prefix = `PRJ-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
    const count = await this.prisma.project.count({
      where: { projectCode: { startsWith: prefix } },
    });
    return `${prefix}-${String(count + 1).padStart(4, "0")}`;
  }

  /**
   * Create a new construction project with automatic costing ledger
   */
  async create(dto: CreateProjectDto, userId: string) {

                try {
                  const projectCode = await this.generateProjectCode();

      return this.prisma.$transaction(async (tx) => {
        // 1. Create the project
        const project = await tx.project.create({
          data: {
            projectCode,
            name: dto.name,
            description: dto.description,
            customerId: dto.customerId,
            projectType: dto.projectType || "RESIDENTIAL",
            startDate: dto.startDate ? new Date(dto.startDate) : undefined,
            expectedEndDate: dto.expectedEndDate ? new Date(dto.expectedEndDate) : undefined,
            estimatedBudget: dto.estimatedBudget || 0,
            address: dto.address,
            city: dto.city,
            state: dto.state,
            pincode: dto.pincode,
            notes: dto.notes,
            createdBy: userId,
          },
        });

        // 2. Automatically scaffold the ProjectCosting ledger
        await tx.projectCosting.create({
          data: {
            projectId: project.id,
            estimatedBudget: dto.estimatedBudget || 0,
          },
        });

        return project;
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ProjectsService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * List projects with pagination, filtering, and search
   */
  async findAll(query: ProjectQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: unknown = { deletedAt: null };
    if (query.status) (where as any).projectStatus = query.status;
    if (query.type) (where as any).projectType = query.type;
    if (query.search) {
      (where as any).OR = [
        { name: { contains: query.search } },
        { projectCode: { contains: query.search } },
        { city: { contains: query.search } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where: where as any,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          customers: { select: { name: true, companyName: true } },
          projectCostings: true,
          _count: { select: { projectSites: true, workers: true, projectPhases: true } },
        },
      }),
      this.prisma.project.count({ where: where as any }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get project by ID with full details
   */
  async findById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        customers: { select: { name: true, companyName: true, mobile: true } },
        projectSites: { where: { deletedAt: null }, orderBy: { createdAt: "desc" } },
        projectPhases: { where: { deletedAt: null }, orderBy: { sequenceOrder: "asc" } },
        projectCostings: true,
        projectExpenses: { orderBy: { expenseDate: "desc" }, take: 20 },
        _count: {
          select: { projectSites: true, workers: true, projectPhases: true, projectExpenses: true },
        },
      },
    });

    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  /**
   * Update project details
   */
  async update(id: string, dto: UpdateProjectDto) {

                try {
                  await this.findById(id);

      const data: unknown = { ...dto };
      if (dto.startDate) (data as any).startDate = new Date(dto.startDate);
      if (dto.expectedEndDate) (data as any).expectedEndDate = new Date(dto.expectedEndDate);
      if (dto.actualEndDate) (data as any).actualEndDate = new Date(dto.actualEndDate);

      // If budget changed, update the costing ledger mirror
      if (dto.estimatedBudget !== undefined) {
        await this.prisma.projectCosting.updateMany({
          where: { projectId: id },
          data: { estimatedBudget: dto.estimatedBudget },
        });
      }

      return this.prisma.project.update({
        where: { id },
        data: data as any,
        include: { projectCostings: true },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ProjectsService', 
                         action: 'update',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  /**
   * Soft-delete a project
   */
  async remove(id: string) {
    await this.findById(id);
    return this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date(), projectStatus: "CANCELLED" },
    });
  }

  // ==========================================
  // PROJECT PHASES
  // ==========================================

  /**
   * Add a phase to a project
   */
  async addPhase(projectId: string, dto: CreatePhaseDto) {
    await this.findById(projectId);

    return this.prisma.projectPhase.create({
      data: {
        projectId,
        name: dto.name,
        sequenceOrder: dto.sequenceOrder || 0,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        estimatedCost: dto.estimatedCost || 0,
        notes: dto.notes,
      },
    });
  }

  /**
   * Update phase status
   */
  async updatePhaseStatus(phaseId: string, status: string, completionPercent?: number) {

                try {
                  const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "SKIPPED"];
      if (!validStatuses.includes(status)) {
        throw new BadRequestException(`Invalid phase status: ${status}`);
      }

      return this.prisma.projectPhase.update({
        where: { id: phaseId },
        data: {
          phaseStatus: status,
          completionPercent: completionPercent ?? undefined,
          endDate: status === "COMPLETED" ? new Date() : undefined,
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ProjectsService', 
                         action: 'updatePhaseStatus',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  // ==========================================
  // ANALYTICS
  // ==========================================

  /**
   * Dashboard statistics
   */
  async getStats() {
    const [totalProjects, activeProjects, completedProjects, totalWorkers, totalBudget] =
      await Promise.all([
        this.prisma.project.count({ where: { deletedAt: null } }),
        this.prisma.project.count({ where: { projectStatus: "ACTIVE", deletedAt: null } }),
        this.prisma.project.count({ where: { projectStatus: "COMPLETED", deletedAt: null } }),
        this.prisma.ecosystemWorkforce.count({ where: { isActive: true, deletedAt: null } }),
        this.prisma.project.aggregate({
          where: { deletedAt: null },
          _sum: { estimatedBudget: true, actualCost: true },
        }),
      ]);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalWorkers,
      totalEstimatedBudget: totalBudget._sum.estimatedBudget || 0,
      totalActualCost: totalBudget._sum.actualCost || 0,
    };
  }
}
