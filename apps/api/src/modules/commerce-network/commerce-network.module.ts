import { Module } from "@nestjs/common";
import { CommerceNetworkController } from "./commerce-network.controller";
import { CommerceNetworkService } from "./commerce-network.service";
import { PrismaModule } from "../../database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [CommerceNetworkController],
  providers: [CommerceNetworkService],
  exports: [CommerceNetworkService],
})
export class CommerceNetworkModule {}
