import { Controller, Get, Post, Body, Param, Query } from "@nestjs/common";
import { ConstructionEquipmentService } from "./construction-equipment.service";

@Controller("construction/equipment")
export class ConstructionEquipmentController {
  constructor(private readonly service: ConstructionEquipmentService) {}

  @Post("assignments")
  assignEquipment(@Body() data: unknown) {
    return this.service.assignEquipment(data);
  }

  @Get("assignments")
  getAssignments(@Query("projectId") projectId: string) {
    return this.service.getAssignments(projectId);
  }
}
