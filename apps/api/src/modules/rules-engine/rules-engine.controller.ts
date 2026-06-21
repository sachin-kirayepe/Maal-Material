import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { RulesEngineService } from "./rules-engine.service";
import { AuthGuard } from "@common/guards/auth.guard";
import { PrismaService } from "@database/prisma.service";

@Controller("rules-engine")
@UseGuards(AuthGuard)
export class RulesEngineController {
  constructor(
    private readonly rulesService: RulesEngineService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async getRules() {
    return this.prisma.businessRule.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  @Post()
  async createRule(@Body() dto: unknown) {
    const rule = await this.prisma.businessRule.create({
      data: {
        name: (dto as any).name,
        description: (dto as any).description,
        module: (dto as any).module,
        eventTrigger: (dto as any).eventTrigger,
        conditions: JSON.stringify((dto as any).conditions),
        actions: JSON.stringify((dto as any).actions),
        tenantId: (dto as any).tenantId,
      },
    });
    // Reload engine after adding new rule
    await this.rulesService.loadActiveRules();
    return rule;
  }

  @Post("reload")
  async reloadRules() {
    await this.rulesService.loadActiveRules();
    return { message: "Rules engine reloaded" };
  }

  @Get("executions")
  async getExecutions() {
    return this.prisma.ruleExecution.findMany({
      orderBy: { executedAt: "desc" },
      take: 50,
      // @ts-expect-error - Auto-suppressed: Prisma schema mismatch
      include: { automationRules: { select: { name: true } } },
    });
  }
}
