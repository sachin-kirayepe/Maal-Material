import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { WorkersController } from "./workers.controller";
import { WorkerAuthController } from "./worker-auth.controller";
import { WorkersService } from "./workers.service";

@Module({
  imports: [AuthModule],
  controllers: [WorkersController, WorkerAuthController],
  providers: [WorkersService],
  exports: [WorkersService],
})
export class WorkersModule {}
