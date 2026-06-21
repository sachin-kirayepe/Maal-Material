import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { MaterialConsumptionController } from "./material-consumption.controller";
import { MaterialConsumptionService } from "./material-consumption.service";

@Module({
  imports: [AuthModule],
  controllers: [MaterialConsumptionController],
  providers: [MaterialConsumptionService],
  exports: [MaterialConsumptionService],
})
export class MaterialConsumptionModule {}
