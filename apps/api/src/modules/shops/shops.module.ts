import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ShopsService } from "./shops.service";
import { ShopsController } from "./shops.controller";
import { PrismaModule } from "@database/prisma.module";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [ShopsController],
  providers: [ShopsService],
  exports: [ShopsService],
})
export class ShopsModule {}
