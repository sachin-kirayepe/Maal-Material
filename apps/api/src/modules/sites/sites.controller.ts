import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { SitesService } from "./sites.service";
import { CreateSiteDto, UpdateSiteDto, SiteQueryDto } from "./dto/site.dto";
import { AuthGuard } from "@common/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller("sites")
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  create(@Body() dto: CreateSiteDto) {
    return this.sitesService.create(dto);
  }

  @Get()
  findAll(@Query() query: SiteQueryDto) {
    return this.sitesService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.sitesService.findById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateSiteDto) {
    return this.sitesService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.sitesService.remove(id);
  }
}
