import { Injectable } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class ReleasesService {
  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async getReleases(tenantId: string) {
    return this.prisma.releaseVersion.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }

  async createRelease(tenantId: string, version: string, notes: string) {

                try {
                  return this.prisma.releaseVersion.create({
        data: {
          tenantId,
          version,
          notes,
        },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'ReleasesService', 
                         action: 'createRelease',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async publishRelease(_tenantId: string, id: string) {
    return this.prisma.releaseVersion.update({
      where: { id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }
}
