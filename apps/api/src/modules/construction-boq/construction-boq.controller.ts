import { Controller, Get, Post, Body, Param, Put, Query } from "@nestjs/common";
import { ConstructionBoqService } from "./construction-boq.service";

@Controller("construction/boq")
export class ConstructionBoqController {
  constructor(private readonly service: ConstructionBoqService) {}

  @Post()
  create(@Body() data: unknown) {
    return this.service.create(data);
  }

  @Get()
  findAll(
    @Query("projectId") projectId: string,
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10"
  ) {
    return this.service.findAll(projectId, Number(page), Number(limit));
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() data: unknown) {
    return this.service.update(id, data);
  }
}
