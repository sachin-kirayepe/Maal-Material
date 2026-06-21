import { Controller, Get, Post, Body } from "@nestjs/common";
import { EcosystemService } from "./ecosystem.service";

@Controller("ecosystem")
export class EcosystemController {
  constructor(private readonly service: EcosystemService) {}

  @Post("connections")
  createConnection(@Body() data: unknown) {
    return this.service.createConnection(data);
  }

  @Get("connections")
  getConnections() {
    return this.service.getConnections();
  }

  @Post("settlements")
  processSettlement(@Body() data: unknown) {
    return this.service.processSettlement(data);
  }

  @Get("settlements")
  getSettlements() {
    return this.service.getSettlements();
  }
}
