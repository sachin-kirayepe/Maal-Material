import { Module } from "@nestjs/common";
import { RiskAssessmentController } from "./risk-assessment.controller";
import { RiskAssessmentService } from "./risk-assessment.service";
import { PrismaModule } from "../../database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [RiskAssessmentController],
  providers: [RiskAssessmentService],
  exports: [RiskAssessmentService],
})
export class RiskAssessmentModule {}
