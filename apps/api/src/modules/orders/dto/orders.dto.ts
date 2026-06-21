import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsEnum } from "class-validator";
import { Type } from "class-transformer";

export class OrderItemDto {
  @IsString()
  productId!: string;

  @IsNumber()
  orderedQty!: number;

  @IsNumber()
  unitPrice!: number;

  @IsNumber()
  @IsOptional()
  taxPercent?: number;

  @IsNumber()
  @IsOptional()
  discountPercent?: number;
}

export class OrderAddressDto {
  @IsString()
  addressLine!: string;

  @IsString()
  city!: string;

  @IsString()
  state!: string;

  @IsString()
  pincode!: string;

  @IsString()
  @IsOptional()
  country?: string;
}

export class CreateOrderDto {
  @IsString()
  customerId!: string;

  @IsString()
  @IsOptional()
  warehouseId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderAddressDto)
  shippingAddress?: OrderAddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderAddressDto)
  billingAddress?: OrderAddressDto;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateOrderStatusDto {
  @IsString()
  @IsEnum(["DRAFT", "PENDING", "CONFIRMED", "PROCESSING", "CANCELLED"])
  status!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
