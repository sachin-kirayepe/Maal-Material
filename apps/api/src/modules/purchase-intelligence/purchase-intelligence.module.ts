import { Module } from "@nestjs/common";
import { PurchaseIntelligenceController } from "./purchase-intelligence.controller";
import { PurchaseIntelligenceService } from "./purchase-intelligence.service";
import { PrismaService } from "../../database/prisma.service";

@Module({
  controllers: [PurchaseIntelligenceController],
  providers: [PurchaseIntelligenceService, PrismaService],
  exports: [PurchaseIntelligenceService],
})
export class PurchaseIntelligenceModule {}
