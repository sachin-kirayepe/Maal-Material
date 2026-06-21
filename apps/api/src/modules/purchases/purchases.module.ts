import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { PurchasesService } from "./purchases.service";
import { PurchasesController } from "./purchases.controller";

@Module({
  imports: [AuthModule, JwtModule],
  controllers: [PurchasesController],
  providers: [PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {}
