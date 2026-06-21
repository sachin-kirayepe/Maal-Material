import { Module } from "@nestjs/common";
import { FraudDetectionController } from "./fraud-detection.controller";
import { FraudDetectionService } from "./fraud-detection.service";
import { PrismaModule } from "../../database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [FraudDetectionController],
  providers: [FraudDetectionService],
  exports: [FraudDetectionService],
})
export class FraudDetectionModule {}
