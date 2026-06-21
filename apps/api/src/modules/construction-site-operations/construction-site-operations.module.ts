import { Module } from "@nestjs/common";
import { ConstructionSiteOperationsController } from "./construction-site-operations.controller";
import { ConstructionSiteOperationsService } from "./construction-site-operations.service";

@Module({
  controllers: [ConstructionSiteOperationsController],
  providers: [ConstructionSiteOperationsService],
})
export class ConstructionSiteOperationsModule {}
