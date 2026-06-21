import { Module } from "@nestjs/common";
import { SimplifiedWorkflowsService } from "./simplified-workflows.service";
import { SimplifiedWorkflowsController } from "./simplified-workflows.controller";

@Module({
  providers: [SimplifiedWorkflowsService],
  controllers: [SimplifiedWorkflowsController],
})
export class SimplifiedWorkflowsModule {}
