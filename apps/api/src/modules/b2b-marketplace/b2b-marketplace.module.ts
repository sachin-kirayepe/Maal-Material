import { Module } from "@nestjs/common";
import { B2bMarketplaceController } from "./b2b-marketplace.controller";
import { B2bMarketplaceService } from "./b2b-marketplace.service";

@Module({
  controllers: [B2bMarketplaceController],
  providers: [B2bMarketplaceService],
})
export class B2bMarketplaceModule {}
