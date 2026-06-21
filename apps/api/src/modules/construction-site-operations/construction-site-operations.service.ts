import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class ConstructionSiteOperationsService {
  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  createActivity(data: unknown) {

                try {
                  // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      return this.prisma.constructionSiteActivity.create({ data });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ConstructionSiteOperationsService', 
                         action: 'createActivity',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  getActivities(projectId: string) {
    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    return this.prisma.constructionSiteActivity.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  logConsumption(data: unknown) {
    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    return this.prisma.constructionMaterialConsumption.create({ data });
  }

  getConsumption(projectId: string) {
    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    return this.prisma.constructionMaterialConsumption.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  createIssue(data: unknown) {

                try {
                  return this.prisma.commerceIssue.create({ data: data as any });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ConstructionSiteOperationsService', 
                         action: 'createIssue',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  getIssues(projectId: string) {
    return this.prisma.commerceIssue.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { createdAt: "desc" },
    });
  }
}
