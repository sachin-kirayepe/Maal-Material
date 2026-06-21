import { Module } from "@nestjs/common";
import { VendorNetworkController } from "./vendor-network.controller";
import { VendorNetworkService } from "./vendor-network.service";

@Module({
  controllers: [VendorNetworkController],
  providers: [VendorNetworkService],
})
export class VendorNetworkModule {}
