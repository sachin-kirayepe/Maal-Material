import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from "@nestjs/common";
import { SettlementsService } from "./settlements.service";
import { CreateSettlementDto } from "./dto/create-settlement.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { createApiResponse } from "@constructos/utils";

@Controller("settlements")
@UseGuards(AuthGuard, RolesGuard)
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @Post()
  @Permissions("settlements:create")
  async createSettlement(@Body() data: CreateSettlementDto, @Request() req: any) {
    const settlement = await this.settlementsService.processSettlement({
      ...(data as any),
      processedBy: req.user!.userId,
    });
    return createApiResponse(true, settlement, "Settlement processed successfully");
  }

  @Get()
  @Permissions("settlements:read")
  async getAllSettlements(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10"
  ) {
    const settlements = await this.settlementsService.getAllSettlements(Number(page), Number(limit));
    return createApiResponse(true, settlements, "Settlements fetched successfully");
  }

  @Get("customer/:customerId")
  @Permissions("settlements:read")
  async getCustomerSettlements(@Param("customerId") customerId: string) {
    const settlements = await this.settlementsService.getCustomerSettlements(customerId);
    return createApiResponse(true, settlements, "Settlements fetched successfully");
  }
}
