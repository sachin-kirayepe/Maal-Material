import { Controller, Get, Post, Body, Param, Put, Delete, Query } from "@nestjs/common";
import { ConstructionProjectsService } from "./construction-projects.service";

@Controller("construction/projects")
export class ConstructionProjectsController {
  constructor(private readonly service: ConstructionProjectsService) {}

  @Post()
  create(@Body() data: unknown) {
    return this.service.create(data);
  }

  @Get()
  findAll(@Query("tenantId") tenantId: string) {
    return this.service.findAll(tenantId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() data: unknown) {
    return this.service.update(id, data);
  }

  @Post(":id/phases")
  addPhase(@Param("id") id: string, @Body() data: unknown) {
    return this.service.addPhase(id, data);
  }

  @Post(":id/milestones")
  addMilestone(@Param("id") id: string, @Body() data: unknown) {
    return this.service.addMilestone(id, data);
  }
}
