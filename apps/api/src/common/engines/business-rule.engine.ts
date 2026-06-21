import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { EventDispatcherService } from "../events/event-dispatcher.service";

/**
 * BusinessRuleEngine
 *
 * Evaluates domain events against tenant-configured BusinessRules.
 * When conditions match, executes defined actions (e.g., auto-approve,
 * send notification, update status) and records RuleExecution audit trails.
 *
 * Condition Language (JSON-based):
 *   { "field": "amount", "op": ">", "value": 50000 }
 *   { "field": "status", "op": "==", "value": "OVERDUE" }
 *   { "all": [ { "field": "amount", "op": ">", "value": 10000 }, { "field": "type", "op": "==", "value": "PURCHASE" } ] }
 */
@Injectable()
export class BusinessRuleEngine {
  private readonly logger = new Logger(BusinessRuleEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventDispatcher: EventDispatcherService,
  ) {}

  /**
   * Evaluates all active rules matching a given event trigger for a tenant!.
   */
  async evaluateEvent(tenantId: string, eventTrigger: string, payload: unknown) {
    this.logger.debug(`Evaluating business rules for event ${eventTrigger} (Tenant: ${tenantId})`);

    const rules = await this.prisma.businessRule.findMany({
      where: { tenantId, eventTrigger, isActive: true },
    });

    const results = [];

    for (const rule of rules) {
      const conditionsMet = this.evaluateConditions(rule.conditions, payload);

      const execution = await this.prisma.ruleExecution.create({
        data: {
          ruleId: rule.id,
          tenantId,
          triggeredBy: eventTrigger,
          payload: JSON.stringify(payload),
          result: conditionsMet ? "MATCHED" : "SKIPPED",
          actionResult: conditionsMet ? await this.executeActions(rule, payload) : null,
        },
      });

      if (conditionsMet) {
        this.logger.log(`Rule "${rule.name}" matched for ${eventTrigger}. Actions executed.`);
        this.eventDispatcher.dispatch("automation", "rule_executed", {
          ruleId: rule.id,
          ruleName: rule.name,
          eventTrigger,
          result: "MATCHED",
        });
      }

      results.push(execution);
    }

    return results;
  }

  /**
   * Evaluates a JSON condition expression against the event payload.
   */
  private evaluateConditions(conditionsJson: string, payload: unknown): boolean {
    try {
      const conditions = JSON.parse(conditionsJson);

      // Support "all" array (AND logic)
      if (conditions.all && Array.isArray(conditions.all)) {
        return conditions.all.every((c: unknown) => this.evaluateSingle(c, payload));
      }

      // Support "any" array (OR logic)
      if (conditions.any && Array.isArray(conditions.any)) {
        return conditions.any.some((c: unknown) => this.evaluateSingle(c, payload));
      }

      // Single condition
      return this.evaluateSingle(conditions, payload);
    } catch {
      this.logger.warn(`Failed to parse conditions: ${conditionsJson}`);
      return false;
    }
  }

  private evaluateSingle(condition: unknown, payload: unknown): boolean {
    const value = (payload as any)[(condition as any).field];
    switch ((condition as any).op) {
      case ">":
        return value > (condition as any).value;
      case "<":
        return value < (condition as any).value;
      case ">=":
        return value >= (condition as any).value;
      case "<=":
        return value <= (condition as any).value;
      case "==":
        return value === (condition as any).value;
      case "!=":
        return value !== (condition as any).value;
      default:
        return false;
    }
  }

  /**
   * Executes the actions defined in a matched rule.
   */
  private async executeActions(rule: unknown, payload: unknown): Promise<string> {
    try {
      const actions = JSON.parse((rule as any).actions);
      // Actions are dispatched as internal events for other engines to process
      for (const action of Array.isArray(actions) ? actions : [actions]) {
        this.eventDispatcher.dispatch("automation", action.type || "rule_action", {
          module: (rule as any).module,
          action,
          payload,
        });
      }
      return JSON.stringify({
        status: "EXECUTED",
        actionCount: Array.isArray(actions) ? actions.length : 1,
      });
    } catch {
      return JSON.stringify({ status: "FAILED", error: "Invalid actions JSON" });
    }
  }
}
