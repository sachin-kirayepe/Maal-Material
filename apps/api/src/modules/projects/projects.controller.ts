import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import {
  CreateProjectDto,
  UpdateProjectDto,
  CreatePhaseDto,
  ProjectQueryDto,
} from "./dto/project.dto";
import { AuthGuard } from "@common/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() dto: CreateProjectDto, @Request() req: unknown) {
    return this.projectsService.create(dto, (req as any).user!.sub || (req as any).user!.id);
  }

  @Get()
  findAll(@Query() query: ProjectQueryDto) {
    return this.projectsService.findAll(query);
  }

  @Get("stats")
  getStats() {
    return this.projectsService.getStats();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectsService.findById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.projectsService.remove(id);
  }

  // Phase endpoints
  @Post(":id/phases")
  addPhase(@Param("id") id: string, @Body() dto: CreatePhaseDto) {
    return this.projectsService.addPhase(id, dto);
  }

  @Patch("phases/:phaseId/status")
  updatePhaseStatus(
    @Param("phaseId") phaseId: string,
    @Body("status") status: string,
    @Body("completionPercent") completionPercent?: number,
  ) {
    return this.projectsService.updatePhaseStatus(phaseId, status, completionPercent);
  }
}
