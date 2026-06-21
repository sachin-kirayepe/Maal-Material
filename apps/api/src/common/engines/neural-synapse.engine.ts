import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * NeuralSynapseEngine — "The Neural Network Manager" (Phase 3J)
 *
 * Manages the lifecycle, topology, and state of `NeuralSynapseNode`
 * entities. Defines the structural pathways through which operational
 * cognitive intelligence flows.
 */
@Injectable()
export class NeuralSynapseEngine {
  private readonly logger = new Logger(NeuralSynapseEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registers a new cognitive processing node within the enterprise neural fabric.
   */
  async registerSynapseNode(
    tenantId: string,
    nodeName: string,
    nodeType: string,
    connectionGraph: unknown,
  ) {
    this.logger.log(`Registering Neural Synapse Node: [${nodeType}] ${nodeName}`);

    return this.prisma.neuralSynapseNode.create({
      data: {
        tenantId,
        nodeName,
        nodeType,
        connectionGraph: JSON.stringify(connectionGraph),
        isActive: true,
      },
    });
  }

  /**
   * Deactivates a neural synapse node, effectively severing its connection to the cognitive fabric.
   */
  async severSynapseNode(nodeId: string) {
    this.logger.warn(`Severing Neural Synapse Node [${nodeId}]`);

    return this.prisma.neuralSynapseNode.update({
      where: { id: nodeId },
      data: { isActive: false },
    });
  }

  /**
   * Retrieves active topology graph for an enterprise.
   */
  async getActiveTopology(tenantId: string) {
    return this.prisma.neuralSynapseNode.findMany({
      where: { tenantId, isActive: true },
    });
  }
}
