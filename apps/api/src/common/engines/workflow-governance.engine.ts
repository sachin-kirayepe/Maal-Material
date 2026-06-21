import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { AutonomousTaskEngine } from "./autonomous-task.engine";

/**
 * WorkflowGovernanceEngine — "The Safety Rail"
 *
 * Evaluates pending autonomous tasks against enterprise governance policies
 * before execution. Forces human escalation if guardrails are breached.
 */
@Injectable()
export class WorkflowGovernanceEngine {
  private readonly logger = new Logger(WorkflowGovernanceEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly taskEngine: AutonomousTaskEngine,
  ) {}

  /**
   * Defines a new governance policy restricting a specific task type.
   */
  async definePolicy(
    tenantId: string,
    policyName: string,
    targetTaskType: string,
    ruleExpression: string,
    action: "REQUIRE_HUMAN" | "BLOCK" | "ALLOW",
  ) {
    this.logger.log(
      `Defining Workflow Policy [${policyName}] for [${targetTaskType}] -> Action: ${action}`,
    );

    return this.prisma.workflowGovernancePolicy.create({
      data: {
        tenantId,
        policyName,
        targetTaskType,
        ruleExpression,
        action,
      },
    });
  }

  /**
   * Validates a pending task's input payload against all active policies for its task type.
   * Escalates the task if 'REQUIRE_HUMAN' or 'BLOCK' policies match.
   */
  async validateTaskSafety(taskId: string): Promise<boolean> {
    const task = await this.prisma.autonomousExecutionTask.findUnique({ where: { id: taskId } });
    if (!task) throw new Error("Task not found.");

    const policies = await this.prisma.workflowGovernancePolicy.findMany({
      where: { tenantId: task.tenantId, targetTaskType: task.taskType, isActive: true },
    });

    if (policies.length === 0) return true; // Safe by default if no rules explicitly target it

    const payload = JSON.parse(task.inputPayload || "{}");

    // Evaluate expressions (In a real system, use a safe sandboxed expression evaluator)
    for (const policy of policies) {
      try {
        // Mock evaluation logic. In production: safe-eval or custom DSL interpreter.
        const isTriggered = this.evaluateMockExpression(policy.ruleExpression, payload);

        if (isTriggered) {
          this.logger.warn(
            `Governance Policy [${policy.policyName}] TRIGGERED for Task [${taskId}]`,
          );

          if (policy.action === "REQUIRE_HUMAN" || policy.action === "BLOCK") {
            await this.taskEngine.escalateTask(
              taskId,
              `Blocked by governance policy: ${policy.policyName}`,
            );
            return false;
          }
        }
      } catch (error) {
        this.logger.error(`Failed to evaluate policy [${policy.policyName}]`, error);
        // Fail closed for safety
        await this.taskEngine.escalateTask(
          taskId,
          `Policy evaluation failure: ${policy.policyName}`,
        );
        return false;
      }
    }

    return true;
  }

  private evaluateMockExpression(expression: string, payload: unknown): boolean {
    // Highly simplified mock for the architecture phase
    // e.g., "payload.amount > 10000"
    if (expression.includes("amount > 10000") && (payload as any).amount > 10000) return true;
    return false;
  }
}
