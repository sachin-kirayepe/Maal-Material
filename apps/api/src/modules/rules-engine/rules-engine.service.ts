import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import { OnEvent } from "@nestjs/event-emitter";
import { Engine } from "json-rules-engine";

@Injectable()
export class RulesEngineService implements OnModuleInit {
  private readonly logger = new Logger(RulesEngineService.name);
  private enginesByTenant: Map<string, Engine> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    this.logger.log("Initializing Rules Engine...");
    await this.loadActiveRules();
  }

  /**
   * Loads active rules from DB and builds json-rules-engine instances per tenant!.
   */
  async loadActiveRules() {
    this.enginesByTenant.clear();
    const rules = await this.prisma.businessRule.findMany({
      where: { isActive: true },
    });

    for (const rule of rules) {
      const tenantId = rule.tenantId || "GLOBAL";

      if (!this.enginesByTenant.has(tenantId)) {
        this.enginesByTenant.set(tenantId, new Engine());
      }

      const engine = this.enginesByTenant.get(tenantId)!;
      try {
        const conditions = JSON.parse(rule.conditions);
        const actions = JSON.parse(rule.actions);

        engine.addRule({
          conditions,
          event: {
            type: rule.eventTrigger,
            params: { ruleId: rule.id, actions },
          },
        });
      } catch (err) {
        this.logger.error(`Failed to parse rule ${rule.id}: ${(err as Error).message}`);
      }
    }
    this.logger.log(`Loaded rules for ${this.enginesByTenant.size} tenants.`);
  }

  /**
   * Listen to ALL domain events (wildcard) and evaluate against the Rules Engine
   */
  @OnEvent("**", { async: true })
  async handleDomainEvent(eventName: string, payload: unknown) {
    // Ignore non-domain events or events without tenant payload
    if (!payload || typeof payload !== "object") return;

    const tenantId = (payload as any).tenantId || "GLOBAL";
    const engine = this.enginesByTenant.get(tenantId);

    if (!engine) return; // No rules for this tenant

    try {
      const { events } = await engine.run({ [eventName]: payload, payload });

      for (const event of events) {
        if (event.type === eventName) {
          await this.executeRuleActions(event.params, payload);
        }
      }
    } catch (err) {
      this.logger.error(`Rule evaluation error on ${eventName}: ${(err as Error).message}`);
    }
  }

  private async executeRuleActions(params: unknown, payload: unknown) {
    const { ruleId, actions } = params as any;

    try {
      // 1. Log execution
      await this.prisma.ruleExecution.create({
        data: {
          ruleId,
          tenantId: (payload as any).tenantId,
          triggeredBy: (payload as any).userId || "SYSTEM",
          payload: JSON.stringify(payload),
          result: "PASSED",
          actionResult: JSON.stringify(actions),
        },
      });

      // 2. Here we could dispatch actions (e.g. notifications, webhook, job queue)
      // For this implementation, we will log it as an Insight if it's an alert
      if (actions.type === "ALERT") {
        await this.prisma.insight.create({
          data: {
            tenantId: (payload as any).tenantId,
            title: actions.title || "Rule Triggered",
            description: actions.message || "A business rule was executed.",
            category: "RISK",
            priority: "HIGH",
          },
        });
      }

      this.logger.log(`Executed rule ${ruleId} successfully.`);
    } catch (err) {
      this.logger.error(`Failed to execute rule ${ruleId}: ${(err as Error).message}`);
    }
  }
}
