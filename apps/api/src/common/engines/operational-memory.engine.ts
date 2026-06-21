import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * OperationalMemoryEngine — "The Institutional Memory"
 *
 * Records and retrieves persistent operational knowledge that survives beyond
 * individual transactions. Supports contextual lookups like:
 * "What do we know about Supplier X in Region Y during Q4?"
 */
@Injectable()
export class OperationalMemoryEngine {
  private readonly logger = new Logger(OperationalMemoryEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Records a new operational memory entry.
   */
  async recordMemory(
    tenantId: string,
    memoryDomain: string,
    subjectEntityType: string,
    subjectEntityId: string,
    memoryContent: string,
    importance: number = 0.5,
    expiresAt?: Date,
  ) {
    this.logger.debug(
      `Recording Memory [${memoryDomain}] for [${subjectEntityType}:${subjectEntityId}]`,
    );

    return this.prisma.operationalMemoryEntry.create({
      data: {
        tenantId,
        memoryDomain,
        subjectEntityType,
        subjectEntityId,
        memoryContent,
        importance,
        expiresAt,
      },
    });
  }

  /**
   * Recalls the most relevant memories for a given entity, ranked by importance.
   */
  async recallMemories(
    tenantId: string,
    subjectEntityType: string,
    subjectEntityId: string,
    memoryDomain?: string,
    limit: number = 10,
  ) {
    this.logger.debug(`Recalling memories for [${subjectEntityType}:${subjectEntityId}]`);

    const memories = await this.prisma.operationalMemoryEntry.findMany({
      where: {
        tenantId,
        subjectEntityType,
        subjectEntityId,
        ...(memoryDomain ? { memoryDomain } : {}),
        OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
      },
      orderBy: { importance: "desc" },
      take: limit,
    });

    // Increment recall count for retrieved memories
    for (const mem of memories) {
      await this.prisma.operationalMemoryEntry.update({
        where: { id: mem.id },
        data: { recalledCount: mem.recalledCount + 1 },
      });
    }

    this.logger.log(
      `Recalled ${memories.length} memories for [${subjectEntityType}:${subjectEntityId}].`,
    );
    return memories;
  }
}
