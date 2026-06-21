import { Controller, Get, Post, Param, UseGuards } from "@nestjs/common";
import { ProjectCostingService } from "./project-costing.service";
import { AuthGuard } from "@common/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("project-costing")
export class ProjectCostingController {
  constructor(private readonly costingService: ProjectCostingService) {}

  @Get("portfolio")
  getPortfolioAnalytics() {
    return this.costingService.getPortfolioAnalytics();
  }

  @Get(":projectId")
  getProjectCosting(@Param("projectId") projectId: string) {
    return this.costingService.getProjectCosting(projectId);
  }

  @Post(":projectId/recalculate")
  recalculateCosting(@Param("projectId") projectId: string) {
    return this.costingService.recalculateCosting(projectId);
  }
}
