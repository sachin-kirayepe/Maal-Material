import { Module } from "@nestjs/common";
import { DigitalExchangeController } from "./digital-exchange.controller";
import { DigitalExchangeService } from "./digital-exchange.service";

@Module({
  controllers: [DigitalExchangeController],
  providers: [DigitalExchangeService],
})
export class DigitalExchangeModule {}
