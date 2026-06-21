import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "../auth/auth.module";
import { StockService } from "./stock.service";
import { StockController } from "./stock.controller";

@Module({
  imports: [AuthModule, JwtModule],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
