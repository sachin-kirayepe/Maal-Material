import { Module } from "@nestjs/common";
import { CommerceIntelligenceController } from "./commerce-intelligence.controller";
import { CommerceIntelligenceService } from "./commerce-intelligence.service";

@Module({
  controllers: [CommerceIntelligenceController],
  providers: [CommerceIntelligenceService],
})
export class CommerceIntelligenceModule {}
