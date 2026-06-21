import { Controller, Get, Post, Body, Param, Put, Query } from "@nestjs/common";
import { ConstructionSiteOperationsService } from "./construction-site-operations.service";

@Controller("construction/site-operations")
export class ConstructionSiteOperationsController {
  constructor(private readonly service: ConstructionSiteOperationsService) {}

  @Post("activities")
  createActivity(@Body() data: unknown) {
    return this.service.createActivity(data);
  }

  @Get("activities")
  getActivities(@Query("projectId") projectId: string) {
    return this.service.getActivities(projectId);
  }

  @Post("consumption")
  logConsumption(@Body() data: unknown) {
    return this.service.logConsumption(data);
  }

  @Get("consumption")
  getConsumption(@Query("projectId") projectId: string) {
    return this.service.getConsumption(projectId);
  }

  @Post("issues")
  createIssue(@Body() data: unknown) {
    return this.service.createIssue(data);
  }

  @Get("issues")
  getIssues(@Query("projectId") projectId: string) {
    return this.service.getIssues(projectId);
  }
}
