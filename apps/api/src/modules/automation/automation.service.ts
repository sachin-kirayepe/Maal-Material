import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class AutomationService {
  private readonly logger = new Logger(AutomationService.name);

  constructor(private prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  async createWorkflow(tenantId: string, data: unknown) {

                try {
                  return this.prisma.automationWorkflow.create({
        data: { ...(data as any), tenantId } as any as any,
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'AutomationService', 
                         action: 'createWorkflow',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async getWorkflows(tenantId: string) {
    return this.prisma.automationWorkflow.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }

  async toggleWorkflow(tenantId: string, id: string, isActive: boolean) {
    return this.prisma.automationWorkflow.update({
      where: { id, tenantId },
      data: { isActive },
    });
  }

  async triggerWorkflow(tenantId: string, id: string, payload: unknown) {
    const workflow = await this.prisma.automationWorkflow.findUnique({
      where: { id, tenantId },
    });

    if (!workflow || !workflow.isActive) {
      throw new NotFoundException("Active workflow not found");
    }

    // Create execution log
    const execution = await this.prisma.workflowExecution.create({
      data: {
        workflowId: workflow.id,
        tenantId,
        status: "RUNNING",
      },
    });

    try {
      // Future: parse workflow.actions JSON and execute them here.
      // Mocking execution logic
      this.logger.log(
        `Executing workflow ${workflow.name} with payload ${JSON.stringify(payload)}`,
      );

      // Mark as success
      await this.prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: "SUCCESS",
          completedAt: new Date(),
          logs: JSON.stringify([
            { step: "init", status: "ok" },
            { step: "execution", status: "ok" },
          ]),
        },
      });

      return execution;
    } catch (error: unknown) {
      await this.prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          error: (error as any).message,
        },
      });
      throw error;
    }
  }
}
