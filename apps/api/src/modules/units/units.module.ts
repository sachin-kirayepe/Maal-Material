import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "../auth/auth.module";
import { UnitsService } from "./units.service";
import { UnitsController } from "./units.controller";

@Module({
  imports: [AuthModule, JwtModule],
  controllers: [UnitsController],
  providers: [UnitsService],
  exports: [UnitsService],
})
export class UnitsModule {}
