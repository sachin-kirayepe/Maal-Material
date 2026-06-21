import { Module } from "@nestjs/common";
import { DistributedController } from "./distributed.controller";
import { DistributedService } from "./distributed.service";

@Module({
  controllers: [DistributedController],
  providers: [DistributedService],
})
export class DistributedModule {}
