import { Module } from "@nestjs/common";
import { OfflineSyncController } from "./offline-sync.controller";
import { OfflineSyncService } from "./offline-sync.service";
import { PrismaModule } from "../../database/prisma.module";
import { ReconciliationModule } from "../reconciliation/reconciliation.module";

@Module({
  imports: [PrismaModule, ReconciliationModule],
  controllers: [OfflineSyncController],
  providers: [OfflineSyncService],
  exports: [OfflineSyncService],
})
export class OfflineSyncModule {}
