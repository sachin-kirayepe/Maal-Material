import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { CheckoutController } from "./checkout.controller";
import { CheckoutService } from "./checkout.service";
import { OrdersModule } from "../orders/orders.module";

@Module({
  imports: [OrdersModule, AuthModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
