import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ShopUsersService } from "./shop-users.service";
import { ShopUsersController } from "./shop-users.controller";
import { PrismaModule } from "@database/prisma.module";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [ShopUsersController],
  providers: [ShopUsersService],
  exports: [ShopUsersService],
})
export class ShopUsersModule {}
