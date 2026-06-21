import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { SuppliersService } from "./suppliers.service";
import { SuppliersController } from "./suppliers.controller";

@Module({
  imports: [AuthModule, JwtModule],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService],
})
export class SuppliersModule {}
