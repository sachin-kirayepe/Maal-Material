import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

/**
 * CrossIndustryReasoningEngine — "The Semantic Inferencer" (Phase 3G)
 *
 * Executes `CrossIndustryReasoningRule` logic against the industrial knowledge graph.
 * Autonomously draws cross-domain inferences (e.g., weather events impacting material curing).
 */
@Injectable()
export class CrossIndustryReasoningEngine {
  private readonly logger = new Logger(CrossIndustryReasoningEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Defines a new reasoning rule for the AI grid.
   */
  async registerReasoningRule(
    tenantId: string,
    ruleName: string,
    triggerCondition: unknown,
    inferredAction: unknown,
  ) {
    this.logger.log(`Registering Cross-Industry Reasoning Rule: [${ruleName}]`);

    return this.prisma.crossIndustryReasoningRule.create({
      data: {
        tenantId,
        ruleName,
        triggerCondition: JSON.stringify(triggerCondition),
        inferredAction: JSON.stringify(inferredAction),
        isActive: true,
      },
    });
  }

  /**
   * Evaluates active reasoning rules against a set of recent semantic nodes or events,
   * returning any actionable inferences drawn by the system.
   */
  async evaluateReasoningEngine(tenantId: string, activeNodes: string[]): Promise<any[]> {
    const rules = await this.prisma.crossIndustryReasoningRule.findMany({
      where: { tenantId, isActive: true },
    });

    const inferences = [];

    for (const rule of rules) {
      // Stub: the AI grid evaluates the active nodes against the triggerCondition
      const isTriggered = this.simulateLogicInference(rule.triggerCondition, activeNodes);

      if (isTriggered) {
        this.logger.debug(`Reasoning Rule Triggered: [${rule.ruleName}] -> Generating Inference.`);
        inferences.push({
          ruleId: rule.id,
          ruleName: rule.ruleName,
          action: JSON.parse(rule.inferredAction),
        });
      }
    }

    return inferences;
  }

  private simulateLogicInference(condition: string, nodes: string[]): boolean {
    return nodes.length > 0; // Stub for demonstration
  }
}
