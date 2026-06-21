import { Module } from "@nestjs/common";
import { PredictionsController } from "./predictions.controller";
import { PredictionsService } from "./predictions.service";
import { PrismaModule } from "../../database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [PredictionsController],
  providers: [PredictionsService],
  exports: [PredictionsService],
})
export class PredictionsModule {}
