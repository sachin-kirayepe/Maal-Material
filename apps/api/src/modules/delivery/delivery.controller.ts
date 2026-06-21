import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { DeliveryService } from "./delivery.service";
import {
  CreateDeliveryDto,
  AssignDeliveryDto,
  UpdateDeliveryStatusDto,
  DeliveryProofDto,
  DeliveryQueryDto,
} from "./dto/delivery.dto";
import { AuthGuard } from "@common/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("deliveries")
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  create(@Body() dto: CreateDeliveryDto, @Request() req: unknown) {
    return this.deliveryService.create(dto, (req as any).user!.sub || (req as any).user!.id);
  }

  @Get()
  findAll(@Query() query: DeliveryQueryDto) {
    return this.deliveryService.findAll(query);
  }

  @Get("stats")
  getStats() {
    return this.deliveryService.getStats();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.deliveryService.findById(id);
  }

  @Patch(":id/assign")
  assignDriver(@Param("id") id: string, @Body() dto: AssignDeliveryDto, @Request() req: unknown) {
    return this.deliveryService.assignDriver(
      id,
      dto,
      (req as any).user!.sub || (req as any).user!.id,
    );
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateDeliveryStatusDto,
    @Request() req: unknown,
  ) {
    return this.deliveryService.updateStatus(
      id,
      dto,
      (req as any).user!.sub || (req as any).user!.id,
    );
  }

  @Post(":id/proof")
  markDelivered(@Param("id") id: string, @Body() dto: DeliveryProofDto, @Request() req: unknown) {
    return this.deliveryService.markDelivered(
      id,
      dto,
      (req as any).user!.sub || (req as any).user!.id,
    );
  }

  @Post(":id/return")
  initiateReturn(@Param("id") id: string, @Body("reason") reason: string, @Request() req: unknown) {
    return this.deliveryService.initiateReturn(
      id,
      reason,
      (req as any).user!.sub || (req as any).user!.id,
    );
  }
}
