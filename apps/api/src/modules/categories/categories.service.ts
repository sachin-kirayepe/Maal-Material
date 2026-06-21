import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database/prisma.service";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from "./dto/categories.dto";
import { RealtimeGateway } from "@modules/realtime/realtime.gateway";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService, private readonly realtimeGateway: RealtimeGateway) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async createCategory(dto: CreateCategoryDto) {

                try {
                  const slug = this.slugify(dto.name);
      const exists = await this.prisma.category.findUnique({ where: { slug } });
      if (exists) throw new ConflictException(`Category '${dto.name}' already exists`);

      return this.prisma.category.create({
        data: {
          name: dto.name,
          slug,
          description: dto.description,
          image: dto.image,
          sortOrder: dto.sortOrder || 0,
        },
        include: { subCategories: true, _count: { select: { products: true } } },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'CategoriesService', 
                         action: 'createCategory',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      where: { deletedAt: null },
      include: {
        subCategories: { where: { deletedAt: null } },
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: "asc" },
    });
  }

  async findCategoryById(id: string) {
    const cat = await this.prisma.category.findFirst({
      where: { id, deletedAt: null },
      include: {
        subCategories: { where: { deletedAt: null } },
        _count: { select: { products: true } },
      },
    });
    if (!cat) throw new NotFoundException(`Category '${id}' not found`);
    return cat;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {

                try {
                  await this.findCategoryById(id);
      const data: unknown = { ...dto };
      if (dto.name) (data as any).slug = this.slugify(dto.name);
      return this.prisma.category.update({
        where: { id },
        data: data as any,
        include: { subCategories: true, _count: { select: { products: true } } },
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'CategoriesService', 
                         action: 'updateCategory',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async removeCategory(id: string) {
    await this.findCategoryById(id);
    await this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { success: true, message: `Category '${id}' removed` };
  }

  // ---- SubCategories ----

  async createSubCategory(dto: CreateSubCategoryDto) {

                try {
                  await this.findCategoryById(dto.categoryId);
      const slug = this.slugify(`${dto.categoryId}-${dto.name}`);
      return this.prisma.subCategory.create({
        data: {
          categoryId: dto.categoryId,
          name: dto.name,
          slug,
          description: dto.description,
          sortOrder: dto.sortOrder || 0,
        },
        // Removed include: { marketplaceCategories: true } due to schema mismatch
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'CategoriesService', 
                         action: 'createSubCategory',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async findSubCategoriesByCategoryId(categoryId: string) {
    return this.prisma.subCategory.findMany({
      where: { categoryId, deletedAt: null },
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: "asc" },
    });
  }

  async updateSubCategory(id: string, dto: UpdateSubCategoryDto) {

                try {
                  const sub = await this.prisma.subCategory.findFirst({ where: { id, deletedAt: null } });
      if (!sub) throw new NotFoundException(`SubCategory '${id}' not found`);
      const data: unknown = { ...dto };
      if (dto.name) (data as any).slug = this.slugify(`${sub.categoryId}-${dto.name}`);
      return this.prisma.subCategory.update({
        where: { id },
        data: data as any,
      });
                } finally {
                  try {
                     if (this.realtimeGateway) {
                       this.realtimeGateway.broadcastToTenant('global', 'module.updated', { 
                         entity: 'CategoriesService', 
                         action: 'updateSubCategory',
                         timestamp: new Date().toISOString()
                       });
                     }
                  } catch(e) {}
                }
              
  }

  async removeSubCategory(id: string) {
    await this.prisma.subCategory.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return { success: true, message: `SubCategory '${id}' removed` };
  }
}
