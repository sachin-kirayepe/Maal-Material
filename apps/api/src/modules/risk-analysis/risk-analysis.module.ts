import { Module } from "@nestjs/common";
import { RiskAnalysisController } from "./risk-analysis.controller";
import { RiskAnalysisService } from "./risk-analysis.service";
import { PrismaModule } from "../../database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [RiskAnalysisController],
  providers: [RiskAnalysisService],
  exports: [RiskAnalysisService],
})
export class RiskAnalysisModule {}
