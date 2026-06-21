import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
  @ApiProperty({ example: "UltraTech Cement OPC 43 Grade" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: "SKU-CEM-001", required: false })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  subCategoryId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  unitId!: string;

  @ApiProperty({ example: 350 })
  @IsNumber()
  @Min(0)
  purchasePrice!: number;

  @ApiProperty({ example: 420 })
  @IsNumber()
  @Min(0)
  sellingPrice!: number;

  @ApiProperty({ example: 450, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  mrp?: number;

  @ApiProperty({ example: 18, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  taxPercent?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  taxCategory?: string;

  @ApiProperty({ example: 10, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  minimumStock?: number;

  @ApiProperty({ example: 20, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reorderLevel?: number;

  @ApiProperty({ example: 50, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reorderQuantity?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  trackInventory?: boolean;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  dimensions?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  manufacturer?: string;

  @IsString()
  @IsOptional()
  hsn?: string;
}

export class UpdateProductDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() barcode?: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() shortDescription?: string;
  @IsString() @IsOptional() image?: string;
  @IsString() @IsOptional() categoryId?: string;
  @IsString() @IsOptional() subCategoryId?: string;
  @IsString() @IsOptional() unitId?: string;
  @IsNumber() @Min(0) @IsOptional() purchasePrice?: number;
  @IsNumber() @Min(0) @IsOptional() sellingPrice?: number;
  @IsNumber() @Min(0) @IsOptional() mrp?: number;
  @IsNumber() @Min(0) @IsOptional() taxPercent?: number;
  @IsString() @IsOptional() taxCategory?: string;
  @IsNumber() @Min(0) @IsOptional() minimumStock?: number;
  @IsNumber() @Min(0) @IsOptional() reorderLevel?: number;
  @IsNumber() @Min(0) @IsOptional() reorderQuantity?: number;
  @IsBoolean() @IsOptional() isActive?: boolean;
  @IsBoolean() @IsOptional() isFeatured?: boolean;
  @IsBoolean() @IsOptional() trackInventory?: boolean;
  @IsNumber() @IsOptional() weight?: number;
  @IsString() @IsOptional() dimensions?: string;
  @IsString() @IsOptional() brand?: string;
  @IsString() @IsOptional() manufacturer?: string;
  @IsString() @IsOptional() hsn?: string;
}

export class ProductQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() categoryId?: string;
  @IsOptional() @IsString() subCategoryId?: string;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsBoolean() lowStock?: boolean;
  @IsOptional() @IsString() sortBy?: string;
  @IsOptional() @IsString() sortOrder?: string;
  @IsOptional() @IsNumber() page?: number;
  @IsOptional() @IsNumber() limit?: number;
}
