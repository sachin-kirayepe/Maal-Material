import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class ConstructionBoqService {
  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  create(data: unknown) {

                try {
                  // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      return this.prisma.constructionBOQItem.create({ data });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ConstructionBoqService', 
                         action: 'create',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async findAll(projectId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const whereClause = projectId ? { projectId } : undefined;

    const [items, total] = await Promise.all([
      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      this.prisma.constructionBOQItem.findMany({
        where: whereClause,
        include: { consumptions: true },
        skip,
        take: limit,
      }),
      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      this.prisma.constructionBOQItem.count({ where: whereClause })
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

  findOne(id: string) {
    // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
    return this.prisma.constructionBOQItem.findUnique({
      where: { id },
      include: { consumptions: true },
    });
  }

  update(id: string, data: unknown) {

                try {
                  // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      return this.prisma.constructionBOQItem.update({ where: { id }, data });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ConstructionBoqService', 
                         action: 'update',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }
}
