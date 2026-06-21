import { Module } from "@nestjs/common";
import { ConstructionProjectsController } from "./construction-projects.controller";
import { ConstructionProjectsService } from "./construction-projects.service";

@Module({
  controllers: [ConstructionProjectsController],
  providers: [ConstructionProjectsService],
})
export class ConstructionProjectsModule {}
