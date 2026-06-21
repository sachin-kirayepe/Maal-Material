import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto, UpdateCategoryDto, CreateSubCategoryDto } from "./dto/categories.dto";
import { AuthGuard } from "@common/guards/auth.guard";
import { RolesGuard } from "@common/guards/roles.guard";
import { Permissions } from "@common/decorators/permissions.decorator";
import { createApiResponse } from "@constructos/utils";

@ApiTags("Inventory - Categories")
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller("categories")
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Post()
  @Permissions("inventory:create")
  @ApiOperation({ summary: "Create a product category" })
  async create(@Body() dto: CreateCategoryDto) {
    const result = await this.service.createCategory(dto);
    return createApiResponse(true, result, "Category created");
  }

  @Get()
  @Permissions("inventory:read")
  @ApiOperation({ summary: "List all categories" })
  async findAll() {
    const result = await this.service.findAllCategories();
    return createApiResponse(true, result);
  }

  @Get(":id")
  @Permissions("inventory:read")
  async findOne(@Param("id") id: string) {
    const result = await this.service.findCategoryById(id);
    return createApiResponse(true, result);
  }

  @Patch(":id")
  @Permissions("inventory:update")
  async update(@Param("id") id: string, @Body() dto: UpdateCategoryDto) {
    const result = await this.service.updateCategory(id, dto);
    return createApiResponse(true, result, "Category updated");
  }

  @Delete(":id")
  @Permissions("inventory:delete")
  async remove(@Param("id") id: string) {
    const result = await this.service.removeCategory(id);
    return createApiResponse(true, result);
  }

  // Sub-categories
  @Post(":id/subcategories")
  @Permissions("inventory:create")
  async createSub(@Param("id") categoryId: string, @Body() dto: CreateSubCategoryDto) {
    dto.categoryId = categoryId;
    const result = await this.service.createSubCategory(dto);
    return createApiResponse(true, result, "SubCategory created");
  }

  @Get(":id/subcategories")
  @Permissions("inventory:read")
  async findSubs(@Param("id") categoryId: string) {
    const result = await this.service.findSubCategoriesByCategoryId(categoryId);
    return createApiResponse(true, result);
  }
}
