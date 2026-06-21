import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * EscalationOrchestratorEngine
 *
 * Processes escalation rules when domain events or SLA breaches trigger them.
 * Evaluates tenant-configured EscalationRules with optional JSON conditions,
 * then executes the defined escalation action (notify, reassign, auto-approve, block).
 */
@Injectable()
export class EscalationOrchestratorEngine {
  private readonly logger = new Logger(EscalationOrchestratorEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Evaluates all active escalation rules matching a source event.
   */
  async processEscalation(tenantId: string, sourceEvent: string, context: unknown) {
    this.logger.debug(`Processing escalation rules for event ${sourceEvent} (Tenant: ${tenantId})`);

    const rules = await this.prisma.escalationRule.findMany({
      where: { tenantId, sourceEvent, isActive: true },
    });

    const executed = [];

    for (const rule of rules) {
      // 1. Check optional condition
      if (rule.conditionJson) {
        const conditionMet = this.evaluateCondition(rule.conditionJson, context);
        if (!conditionMet) continue;
      }

      this.logger.log(
        `Escalation rule "${rule.name}" triggered for ${sourceEvent}. Action: ${rule.escalationAction}`,
      );

      // 2. Execute the escalation action
      switch (rule.escalationAction) {
        case "NOTIFY_MANAGER":
          this.eventDispatcher.dispatch("automation", "escalation_notify", {
            ruleName: rule.name,
            targetRole: rule.targetRole,
            context,
          });
          break;

        case "REASSIGN":
          this.eventDispatcher.dispatch("automation", "escalation_reassign", {
            ruleName: rule.name,
            targetRole: rule.targetRole,
            context,
          });
          break;

        case "AUTO_APPROVE":
          this.eventDispatcher.dispatch("automation", "escalation_auto_approve", {
            ruleName: rule.name,
            context,
          });
          break;

        case "BLOCK_ENTITY":
          this.eventDispatcher.dispatch("trust", "entity_blocked_by_escalation", {
            ruleName: rule.name,
            entityId: (context as any).entityId || (context as any).againstEntityId,
          });
          break;

        case "ALERT_ADMIN":
          await this.prisma.operationalAlert.create({
            data: {
              tenantId,
              type: "ESCALATION_ALERT",
              severity: "CRITICAL",
              message: `Escalation rule "${rule.name}" triggered: ${sourceEvent}`,
              source: "EscalationOrchestratorEngine",
              metadata: JSON.stringify(context),
            },
          });
          break;

        default:
          this.logger.warn(`Unknown escalation action: ${rule.escalationAction}`);
      }

      executed.push({ ruleId: rule.id, ruleName: rule.name, action: rule.escalationAction });
    }

    return executed;
  }

  /**
   * Evaluates a JSON condition against the context.
   */
  private evaluateCondition(conditionJson: string, context: unknown): boolean {
    try {
      const condition = JSON.parse(conditionJson);
      const value = (context as any)[condition.field];

      switch (condition.op) {
        case ">":
          return value > condition.value;
        case "<":
          return value < condition.value;
        case ">=":
          return value >= condition.value;
        case "<=":
          return value <= condition.value;
        case "==":
          return value === condition.value;
        case "!=":
          return value !== condition.value;
        default:
          return true;
      }
    } catch {
      return true; // If condition parsing fails, default to executing
    }
  }
}
