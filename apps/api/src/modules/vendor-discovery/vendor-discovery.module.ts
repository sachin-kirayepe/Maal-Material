import { Module } from "@nestjs/common";
import { VendorDiscoveryController } from "./vendor-discovery.controller";
import { VendorDiscoveryService } from "./vendor-discovery.service";
import { PrismaModule } from "../../database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [VendorDiscoveryController],
  providers: [VendorDiscoveryService],
  exports: [VendorDiscoveryService],
})
export class VendorDiscoveryModule {}
