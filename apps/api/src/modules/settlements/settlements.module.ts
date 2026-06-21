import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { SettlementsService } from "./settlements.service";
import { SettlementsController } from "./settlements.controller";
import { PrismaModule } from "@database/prisma.module";
import { LedgerModule } from "../ledger/ledger.module";

@Module({
  imports: [AuthModule, PrismaModule, LedgerModule, JwtModule], // Importing LedgerModule
  controllers: [SettlementsController],
  providers: [SettlementsService],
  exports: [SettlementsService],
})
export class SettlementsModule {}
