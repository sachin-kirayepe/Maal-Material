import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * EvolvingMemoryFabricEngine — "The Living Memory" (Phase 3C)
 *
 * Manages a biologically-inspired memory network where knowledge nodes
 * strengthen through validation and decay through disuse. Supports three
 * memory types: PROCEDURAL (how-to), EPISODIC (specific events), and
 * SEMANTIC (general facts). Memories that are repeatedly validated by
 * real-world outcomes become stronger; stale memories naturally decay.
 */
@Injectable()
export class EvolvingMemoryFabricEngine {
  private readonly logger = new Logger(EvolvingMemoryFabricEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Stores a new memory node in the fabric.
   */
  async storeMemory(
    tenantId: string,
    memoryType: "PROCEDURAL" | "EPISODIC" | "SEMANTIC",
    domain: string,
    content: unknown,
    initialStrength: number = 0.5,
  ) {
    this.logger.debug(`Storing [${memoryType}] memory in [${domain}]`);

    return this.prisma.evolvingMemoryFabricNode.create({
      data: {
        tenantId,
        memoryType,
        domain,
        contentJson: JSON.stringify(content),
        strength: initialStrength,
      },
    });
  }

  /**
   * Reinforces a memory when a real-world outcome validates it.
   * Strength increases logarithmically to prevent runaway amplification.
   */
  async reinforceMemory(memoryId: string) {
    const memory = await this.prisma.evolvingMemoryFabricNode.findUnique({
      where: { id: memoryId },
    });
    if (!memory) return null;

    const newStrength = Math.min(1.0, memory.strength + (1.0 - memory.strength) * 0.1);

    this.logger.log(
      `Reinforcing Memory [${memoryId}]: ${memory.strength.toFixed(3)} → ${newStrength.toFixed(3)}`,
    );

    return this.prisma.evolvingMemoryFabricNode.update({
      where: { id: memoryId },
      data: {
        strength: newStrength,
        reinforceCount: memory.reinforceCount + 1,
        lastReinforcedAt: new Date(),
      },
    });
  }

  /**
   * Applies time-based decay to all memories in a domain.
   * Memories that decay below a threshold are deactivated.
   */
  async applyDecay(tenantId: string, domain: string, deactivationThreshold: number = 0.05) {
    const memories = await this.prisma.evolvingMemoryFabricNode.findMany({
      where: { tenantId, domain },
    });

    let decayed = 0;
    let deactivated = 0;

    for (const mem of memories) {
      const newStrength = mem.strength * (1.0 - mem.decayRate);

      if (newStrength < deactivationThreshold) {
        await this.prisma.evolvingMemoryFabricNode.delete({ where: { id: mem.id } });
        deactivated++;
      } else {
        await this.prisma.evolvingMemoryFabricNode.update({
          where: { id: mem.id },
          data: { strength: newStrength },
        });
        decayed++;
      }
    }

    this.logger.log(`Memory Decay [${domain}]: ${decayed} decayed, ${deactivated} deactivated.`);
    return { decayed, deactivated };
  }

  /**
   * Retrieves the strongest memories for a domain, useful for AI context injection.
   */
  async recallStrongest(tenantId: string, domain: string, memoryType?: string, limit: number = 10) {
    return this.prisma.evolvingMemoryFabricNode.findMany({
      where: {
        tenantId,
        domain,
        ...(memoryType ? { memoryType } : {}),
      },
      orderBy: { strength: "desc" },
      take: limit,
    });
  }
}
