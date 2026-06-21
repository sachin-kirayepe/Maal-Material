import { Module } from "@nestjs/common";
import { SourcingController } from "./sourcing.controller";
import { SourcingService } from "./sourcing.service";
import { PrismaService } from "../../database/prisma.service";

@Module({
  controllers: [SourcingController],
  providers: [SourcingService, PrismaService],
  exports: [SourcingService],
})
export class SourcingModule {}
