import { Module } from "@nestjs/common";
import { UniversalApiController } from "./universal-api.controller";
import { CommonEnginesModule } from "../../common/engines/engines.module";

@Module({
  imports: [CommonEnginesModule],
  controllers: [UniversalApiController],
})
export class UniversalApiModule {}
