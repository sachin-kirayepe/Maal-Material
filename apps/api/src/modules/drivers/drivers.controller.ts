import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { DriversService } from "./drivers.service";
import {
  CreateDriverDto,
  UpdateDriverDto,
  UpdateDriverAvailabilityDto,
  DriverQueryDto,
} from "./dto/drivers.dto";
import { AuthGuard } from "@common/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("drivers")
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  findAll(@Query() query: DriverQueryDto) {
    return this.driversService.findAll(query);
  }

  @Get("available")
  getAvailableDrivers() {
    return this.driversService.getAvailableDrivers();
  }

  @Get("stats")
  getStats() {
    return this.driversService.getStats();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.driversService.findById(id);
  }

  @Get(":id/deliveries")
  getDriverDeliveries(@Param("id") id: string) {
    return this.driversService.getDriverDeliveries(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driversService.update(id, updateDriverDto);
  }

  @Patch(":id/availability")
  updateAvailability(@Param("id") id: string, @Body() dto: UpdateDriverAvailabilityDto) {
    return this.driversService.updateAvailability(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.driversService.remove(id);
  }
}
