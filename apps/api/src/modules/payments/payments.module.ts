import { Module } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { PaymentsController } from "./payments.controller";
import { GatewayService } from "./gateway.service";
import { WebhookController } from "./webhook.controller";
import { PrismaModule } from "@database/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { RbacModule } from "../rbac/rbac.module";

@Module({
  imports: [PrismaModule, AuthModule, RbacModule],
  controllers: [PaymentsController, WebhookController],
  providers: [PaymentsService, GatewayService],
  exports: [PaymentsService, GatewayService],
})
export class PaymentsModule {}
