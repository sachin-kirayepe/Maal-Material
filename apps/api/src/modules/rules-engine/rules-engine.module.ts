import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { RulesEngineController } from "./rules-engine.controller";
import { RulesEngineService } from "./rules-engine.service";

@Module({
  imports: [AuthModule],
  controllers: [RulesEngineController],
  providers: [RulesEngineService],
})
export class RulesEngineModule {}
