import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { OrderFulfillmentController } from "./order-fulfillment.controller";
import { OrderFulfillmentService } from "./order-fulfillment.service";

@Module({
  imports: [AuthModule],
  controllers: [OrderFulfillmentController],
  providers: [OrderFulfillmentService],
})
export class OrderFulfillmentModule {}
