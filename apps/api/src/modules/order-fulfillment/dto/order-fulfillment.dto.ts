import { IsString, IsArray, ValidateNested, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class FulfillmentItemDto {
  @IsString()
  orderItemId!: string;

  @IsString()
  productId!: string;

  @IsNumber()
  quantity!: number;
}

export class CreateFulfillmentDto {
  @IsString()
  orderId!: string;

  @IsString()
  warehouseId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FulfillmentItemDto)
  items!: FulfillmentItemDto[];

  @IsString()
  @IsOptional()
  carrier?: string;

  @IsString()
  @IsOptional()
  trackingNumber?: string;
}
