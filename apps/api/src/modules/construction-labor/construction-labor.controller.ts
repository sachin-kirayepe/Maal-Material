import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { ConstructionLaborService } from "./construction-labor.service";

@Controller("construction/labor")
export class ConstructionLaborController {
  constructor(private readonly service: ConstructionLaborService) {}

  @Post("attendance")
  logAttendance(@Body() data: unknown) {
    return this.service.logAttendance(data);
  }

  @Get("attendance")
  getAttendance(@Query("projectId") projectId: string) {
    return this.service.getAttendance(projectId);
  }

  @Get("productivity")
  getProductivity(@Query("projectId") projectId: string) {
    return this.service.getProductivity(projectId);
  }
}
