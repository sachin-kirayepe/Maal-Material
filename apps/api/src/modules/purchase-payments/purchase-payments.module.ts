import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { PurchasePaymentsService } from "./purchase-payments.service";
import { PurchasePaymentsController } from "./purchase-payments.controller";

@Module({
  imports: [AuthModule, JwtModule],
  controllers: [PurchasePaymentsController],
  providers: [PurchasePaymentsService],
  exports: [PurchasePaymentsService],
})
export class PurchasePaymentsModule {}
