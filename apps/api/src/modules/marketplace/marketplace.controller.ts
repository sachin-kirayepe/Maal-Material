import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { MarketplaceService } from "./marketplace.service";
import { CreateListingDto } from "./dto/create-listing.dto";
import { UpdateListingDto } from "./dto/update-listing.dto";
import { QueryListingDto } from "./dto/query-listing.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { TenantGuard } from "@common/guards/tenant.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { TenantId } from "@common/decorators/tenant-id.decorator";

@Controller("marketplace")
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  // ==========================================
  // PUBLIC ENDPOINTS
  // ==========================================

  @Get("listings")
  findAllPublic(@Query() query: QueryListingDto) {
    return this.marketplaceService.findAllListings(query);
  }

  @Get("listings/:id")
  findOnePublic(@Param("id") id: string) {
    return this.marketplaceService.findListingById(id);
  }

  @Get("categories")
  findCategoriesPublic() {
    return this.marketplaceService.findCategories();
  }

  // ==========================================
  // TENANT ENDPOINTS (Requires Auth & Tenant Context)
  // ==========================================

  @Post("listings")
  @UseGuards(AuthGuard, RolesGuard, TenantGuard)
  @Permissions("marketplace:sell")
  createListing(@TenantId() tenantId: string, @Body() dto: CreateListingDto) {
    return this.marketplaceService.createListing(tenantId, dto);
  }

  @Patch("listings/:id")
  @UseGuards(AuthGuard, RolesGuard, TenantGuard)
  @Permissions("marketplace:sell")
  updateListing(
    @Param("id") id: string,
    @TenantId() tenantId: string,
    @Body() dto: UpdateListingDto,
  ) {
    return this.marketplaceService.updateListing(id, tenantId, dto);
  }

  @Delete("listings/:id")
  @UseGuards(AuthGuard, RolesGuard, TenantGuard)
  @Permissions("marketplace:sell")
  deleteListing(@Param("id") id: string, @TenantId() tenantId: string) {
    return this.marketplaceService.deleteListing(id, tenantId);
  }

  // ==========================================
  // ADMIN ENDPOINTS
  // ==========================================

  @Post("categories")
  @UseGuards(AuthGuard, RolesGuard)
  @Permissions("marketplace:manage")
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.marketplaceService.createCategory(dto);
  }

  @Get("analytics")
  @UseGuards(AuthGuard, RolesGuard)
  @Permissions("marketplace:manage")
  getAnalytics() {
    return this.marketplaceService.getMarketplaceAnalytics();
  }
}
