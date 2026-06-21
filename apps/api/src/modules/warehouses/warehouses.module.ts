import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "../auth/auth.module";
import { WarehousesService } from "./warehouses.service";
import { WarehousesController } from "./warehouses.controller";

@Module({
  imports: [AuthModule, JwtModule],
  controllers: [WarehousesController],
  providers: [WarehousesService],
  exports: [WarehousesService],
})
export class WarehousesModule {}
