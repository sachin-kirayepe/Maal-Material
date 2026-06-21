import { Module } from "@nestjs/common";
import { InventorySharingController } from "./inventory-sharing.controller";
import { InventorySharingService } from "./inventory-sharing.service";
import { PrismaModule } from "../../database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [InventorySharingController],
  providers: [InventorySharingService],
  exports: [InventorySharingService],
})
export class InventorySharingModule {}
