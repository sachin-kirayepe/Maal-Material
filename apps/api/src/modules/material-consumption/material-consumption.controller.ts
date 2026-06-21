import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { MaterialConsumptionService } from "./material-consumption.service";
import {
  CreateSiteTransferDto,
  ReceiveSiteTransferDto,
  RecordConsumptionDto,
  ConsumptionQueryDto,
} from "./dto/material-consumption.dto";
import { AuthGuard } from "@common/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("material-consumption")
export class MaterialConsumptionController {
  constructor(private readonly materialService: MaterialConsumptionService) {}

  // ==== SITE TRANSFERS ====

  @Post("transfers")
  createTransfer(@Body() dto: CreateSiteTransferDto, @Request() req: unknown) {
    return this.materialService.createTransfer(
      dto,
      (req as any).user!.sub || (req as any).user!.id,
    );
  }

  @Patch("transfers/:id/receive")
  receiveTransfer(
    @Param("id") id: string,
    @Body() dto: ReceiveSiteTransferDto,
    @Request() req: unknown,
  ) {
    return this.materialService.receiveTransfer(
      id,
      dto,
      (req as any).user!.sub || (req as any).user!.id,
    );
  }

  @Get("transfers")
  findAllTransfers(
    @Query() query: { siteId?: string; status?: string; page?: number; limit?: number },
  ) {
    return this.materialService.findAllTransfers(query);
  }

  // ==== CONSUMPTION ====

  @Post("consume")
  recordConsumption(@Body() dto: RecordConsumptionDto, @Request() req: unknown) {
    return this.materialService.recordConsumption(
      dto,
      (req as any).user!.sub || (req as any).user!.id,
    );
  }

  @Get("consumptions")
  findAllConsumptions(@Query() query: ConsumptionQueryDto) {
    return this.materialService.findAllConsumptions(query);
  }

  // ==== SITE INVENTORY ====

  @Get("inventory/:siteId")
  getSiteInventory(@Param("siteId") siteId: string) {
    return this.materialService.getSiteInventory(siteId);
  }
}
