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
import { DispatchService } from "./dispatch.service";
import { CreateDispatchDto, DispatchQueryDto } from "./dto/dispatch.dto";
import { AuthGuard } from "@common/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("dispatch")
export class DispatchController {
  constructor(private readonly dispatchService: DispatchService) {}

  @Post()
  create(@Body() dto: CreateDispatchDto, @Request() req: unknown) {
    return this.dispatchService.create(dto, (req as any).user!.sub || (req as any).user!.id);
  }

  @Get()
  findAll(@Query() query: DispatchQueryDto) {
    return this.dispatchService.findAll(query);
  }

  @Get("stats")
  getStats() {
    return this.dispatchService.getStats();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.dispatchService.findById(id);
  }

  @Patch(":id/approve")
  approve(@Param("id") id: string, @Request() req: unknown) {
    return this.dispatchService.approve(id, (req as any).user!.sub || (req as any).user!.id);
  }

  @Patch(":id/picking")
  markPicking(@Param("id") id: string) {
    return this.dispatchService.markPicking(id);
  }

  @Patch(":id/pack")
  markPacked(@Param("id") id: string, @Request() req: unknown) {
    return this.dispatchService.markPacked(id, (req as any).user!.sub || (req as any).user!.id);
  }

  @Patch(":id/dispatch")
  markDispatched(@Param("id") id: string, @Request() req: unknown) {
    return this.dispatchService.markDispatched(id, (req as any).user!.sub || (req as any).user!.id);
  }

  @Patch(":id/cancel")
  cancel(@Param("id") id: string, @Body("reason") reason: string, @Request() req: unknown) {
    return this.dispatchService.cancel(id, (req as any).user!.sub || (req as any).user!.id, reason);
  }
}
