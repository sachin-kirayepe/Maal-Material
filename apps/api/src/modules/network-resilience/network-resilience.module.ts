import { Module } from "@nestjs/common";
import { NetworkResilienceController } from "./network-resilience.controller";
import { NetworkResilienceService } from "./network-resilience.service";
import { PrismaModule } from "../../database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [NetworkResilienceController],
  providers: [NetworkResilienceService],
  exports: [NetworkResilienceService],
})
export class NetworkResilienceModule {}
