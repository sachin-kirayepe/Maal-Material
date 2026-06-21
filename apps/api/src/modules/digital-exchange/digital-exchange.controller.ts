import { Controller, Get, Post, Body } from "@nestjs/common";
import { DigitalExchangeService } from "./digital-exchange.service";

@Controller("digital-exchange")
export class DigitalExchangeController {
  constructor(private readonly service: DigitalExchangeService) {}

  @Post("rfqs")
  createRfq(@Body() data: unknown) {
    return this.service.createRfq(data);
  }

  @Get("rfqs")
  getRfqs() {
    return this.service.getRfqs();
  }

  @Post("quotations")
  submitQuotation(@Body() data: unknown) {
    return this.service.submitQuotation(data);
  }
}
