import { Module } from "@nestjs/common";
import { RfqExchangeController } from "./rfq-exchange.controller";
import { RfqExchangeService } from "./rfq-exchange.service";
import { PrismaModule } from "../../database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [RfqExchangeController],
  providers: [RfqExchangeService],
  exports: [RfqExchangeService],
})
export class RfqExchangeModule {}
