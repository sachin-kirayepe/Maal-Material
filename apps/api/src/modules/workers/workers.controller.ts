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
} from "@nestjs/common";
import { WorkersService } from "./workers.service";
import { CreateWorkerDto, UpdateWorkerDto, WorkerQueryDto } from "./dto/worker.dto";
import { AuthGuard } from "@common/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("workers")
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  create(@Body() dto: CreateWorkerDto) {
    return this.workersService.create(dto);
  }

  @Get()
  findAll(@Query() query: WorkerQueryDto) {
    return this.workersService.findAll(query);
  }

  @Get("skills")
  getSkillBreakdown() {
    return this.workersService.getSkillBreakdown();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.workersService.findById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateWorkerDto) {
    return this.workersService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.workersService.remove(id);
  }
}
