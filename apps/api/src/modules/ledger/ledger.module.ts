import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { LedgerService } from "./ledger.service";
import { LedgerController } from "./ledger.controller";
import { PrismaModule } from "@database/prisma.module";

@Module({
  imports: [AuthModule, PrismaModule, JwtModule],
  controllers: [LedgerController],
  providers: [LedgerService],
  exports: [LedgerService], // Exported for settlements & invoices to use
})
export class LedgerModule {}
