import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ProjectCostingController } from "./project-costing.controller";
import { ProjectCostingService } from "./project-costing.service";

@Module({
  imports: [AuthModule],
  controllers: [ProjectCostingController],
  providers: [ProjectCostingService],
  exports: [ProjectCostingService],
})
export class ProjectCostingModule {}
