import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TenantsService } from "./tenants.service";
import { TenantsController } from "./tenants.controller";
import { PrismaModule } from "@database/prisma.module";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [TenantsController],
  providers: [TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
