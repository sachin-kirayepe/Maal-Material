import { Controller, Get } from "@nestjs/common";
import { CommerceIntelligenceService } from "./commerce-intelligence.service";

@Controller("commerce-intelligence")
export class CommerceIntelligenceController {
  constructor(private readonly service: CommerceIntelligenceService) {}

  @Get("analytics")
  getAnalytics() {
    return this.service.getAnalytics();
  }
}
