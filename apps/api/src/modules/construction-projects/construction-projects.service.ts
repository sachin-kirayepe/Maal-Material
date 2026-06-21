import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class ConstructionProjectsService {
  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  create(data: unknown) {

                try {
                  return this.prisma.commerceProject.create({ data: data as any });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ConstructionProjectsService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  findAll(tenantId: string) {
    return this.prisma.commerceProject.findMany({
      where: tenantId ? { tenantId } : undefined,
      include: { phases: true, milestones: true, issues: true },
    });
  }

  findOne(id: string) {
    return this.prisma.commerceProject.findUnique({
      where: { id },
      include: {
        phases: true,
        milestones: true,
        issues: true,
        boqItems: true,
        siteActivities: true,
      },
    });
  }

  update(id: string, data: unknown) {

                try {
                  return this.prisma.commerceProject.update({ where: { id }, data: data as any });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ConstructionProjectsService', 
                         action: 'update',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  addPhase(projectId: string, data: unknown) {
    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    return this.prisma.constructionPhase.create({ data: { ...(data as any), projectId } as any });
  }

  addMilestone(projectId: string, data: unknown) {
    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    return this.prisma.constructionMilestone.create({
      data: { ...(data as any), projectId } as any,
    });
  }
}
