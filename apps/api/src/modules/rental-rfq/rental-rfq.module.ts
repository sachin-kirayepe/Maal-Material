import { Module } from "@nestjs/common";
import { RentalRfqController } from "./rental-rfq.controller";
import { RentalRfqService } from "./rental-rfq.service";
import { PrismaModule } from "../../database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [RentalRfqController],
  providers: [RentalRfqService],
  exports: [RentalRfqService],
})
export class RentalRfqModule {}
