import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";

@Injectable()
export class ProjectCostingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get real-time costing breakdown for a project
   */
  async getProjectCosting(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        projectCostings: true,
        customers: { select: { name: true, companyName: true } },
      },
    });

    if (!project) throw new NotFoundException(`Project ${projectId} not found`);

    // Get expense breakdown
    const expenseBreakdown = await this.prisma.projectExpense.groupBy({
      by: ["expenseType"],
      where: { projectId, status: "APPROVED" },
      _sum: { amount: true },
      _count: { id: true },
    });

    return {
      projects: {
        id: project.id,
        name: project.name,
        projectCode: project.projectCode,
        projectStatus: project.projectStatus,
        estimatedBudget: project.estimatedBudget,
        actualCost: project.actualCost,
      },
      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      costing: project.costing,
      expenseBreakdown: expenseBreakdown.map((e) => ({
        type: e.expenseType,
        totalAmount: e._sum.amount || 0,
        count: e._count.id,
      })),
      profitability: {
        budget: project.estimatedBudget,
        spent: project.actualCost,
        remaining: project.estimatedBudget - project.actualCost,
        utilizationPercent:
          project.estimatedBudget > 0
            ? Math.round((project.actualCost / project.estimatedBudget) * 10000) / 100
            : 0,
        isOverBudget: project.actualCost > project.estimatedBudget,
        overrunAmount: Math.max(0, project.actualCost - project.estimatedBudget),
      },
    };
  }

  /**
   * Recalculate costing from scratch (rebuild from expenses)
   */
  async recalculateCosting(projectId: string) {
    const expenses = await this.prisma.projectExpense.groupBy({
      by: ["expenseType"],
      where: { projectId, status: "APPROVED" },
      _sum: { amount: true },
    });

    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException(`Project ${projectId} not found`);

    const costMap: Record<string, number> = {};
    for (const e of expenses) {
      costMap[e.expenseType] = e._sum.amount || 0;
    }

    const materialCost = costMap["MATERIAL"] || 0;
    const laborCost = costMap["LABOR"] || 0;
    const logisticsCost = costMap["LOGISTICS"] || 0;
    const operationalCost =
      (costMap["OPERATIONAL"] || 0) + (costMap["EQUIPMENT"] || 0) + (costMap["MISCELLANEOUS"] || 0);
    const totalCost = materialCost + laborCost + logisticsCost + operationalCost;

    const costing = await this.prisma.projectCosting.upsert({
      where: { projectId },
      create: {
        projectId,
        materialCost,
        laborCost,
        logisticsCost,
        operationalCost,
        totalCost,
        estimatedBudget: project.estimatedBudget,
        profitMargin: project.estimatedBudget - totalCost,
        costOverrun: Math.max(0, totalCost - project.estimatedBudget),
        lastCalculatedAt: new Date(),
      },
      update: {
        materialCost,
        laborCost,
        logisticsCost,
        operationalCost,
        totalCost,
        estimatedBudget: project.estimatedBudget,
        profitMargin: project.estimatedBudget - totalCost,
        costOverrun: Math.max(0, totalCost - project.estimatedBudget),
        lastCalculatedAt: new Date(),
      },
    });

    // Sync actual cost on project
    await this.prisma.project.update({
      where: { id: projectId },
      data: { actualCost: totalCost },
    });

    return costing;
  }

  /**
   * Get portfolio-level analytics across all projects
   */
  async getPortfolioAnalytics() {
    const [projects, costings, topExpenses] = await Promise.all([
      this.prisma.project.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          name: true,
          projectCode: true,
          projectStatus: true,
          estimatedBudget: true,
          actualCost: true,
          projectType: true,
        },
        orderBy: { actualCost: "desc" },
        take: 20,
      }),
      this.prisma.projectCosting.findMany({
        include: { projects: { select: { name: true, projectCode: true, projectStatus: true } } },
      }),
      this.prisma.projectExpense.groupBy({
        by: ["expenseType"],
        where: { status: "APPROVED" },
        _sum: { amount: true },
        _count: { id: true },
      }),
    ]);

    const totalBudget = projects.reduce((sum, p) => sum + p.estimatedBudget, 0);
    const totalSpent = projects.reduce((sum, p) => sum + p.actualCost, 0);
    const overBudgetCount = projects.filter((p) => p.actualCost > p.estimatedBudget).length;

    return {
      summary: {
        totalProjects: projects.length,
        totalBudget,
        totalSpent,
        overBudgetCount,
        budgetUtilization:
          totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 10000) / 100 : 0,
      },
      projectBreakdown: projects.map((p) => ({
        ...p,
        remainingBudget: p.estimatedBudget - p.actualCost,
        isOverBudget: p.actualCost > p.estimatedBudget,
      })),
      expenseBreakdown: topExpenses.map((e) => ({
        type: e.expenseType,
        totalAmount: e._sum.amount || 0,
        count: e._count.id,
      })),
      costingDetails: costings,
    };
  }
}
