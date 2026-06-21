import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { BusinessIntelligenceController } from "./business-intelligence.controller";
import { BusinessIntelligenceService } from "./business-intelligence.service";

@Module({
  imports: [AuthModule],
  controllers: [BusinessIntelligenceController],
  providers: [BusinessIntelligenceService],
})
export class BusinessIntelligenceModule {}
