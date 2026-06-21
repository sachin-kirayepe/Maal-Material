import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, IsEnum } from "class-validator";
import { Type } from "class-transformer";

export class DispatchItemDto {
  @IsString()
  productId!: string;

  @IsString()
  productName!: string;

  @IsNumber()
  quantity!: number;
}

export class CreateDispatchDto {
  @IsString()
  deliveryId!: string;

  @IsString()
  warehouseId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DispatchItemDto)
  items!: DispatchItemDto[];

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateDispatchStatusDto {
  @IsString()
  @IsEnum(["PENDING", "APPROVED", "PICKING", "PACKED", "DISPATCHED", "CANCELLED"])
  status!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class DispatchQueryDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  warehouseId?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
