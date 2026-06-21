import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PurchaseOrderItemDto {
  @ApiProperty() @IsString() productId!: string;
  @ApiProperty() @IsNumber() orderedQty!: number;
  @ApiProperty() @IsNumber() unitPrice!: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() taxPercent?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() discountPercent?: number;
}

export class CreatePurchaseOrderDto {
  @ApiProperty() @IsString() supplierId!: string;
  @ApiProperty() @IsString() warehouseId!: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expectedDelivery?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() terms?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() shippingCost?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() discount?: number;

  @ApiProperty({ type: [PurchaseOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderItemDto)
  items!: PurchaseOrderItemDto[];
}

export class GoodsReceiptItemDto {
  @ApiProperty() @IsString() purchaseOrderItemId!: string;
  @ApiProperty() @IsString() productId!: string;
  @ApiProperty() @IsNumber() receivedQty!: number;
  @ApiProperty() @IsNumber() acceptedQty!: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() rejectedQty?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() damagedQty?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class CreateGoodsReceiptDto {
  @ApiProperty() @IsString() purchaseOrderId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;

  @ApiProperty({ type: [GoodsReceiptItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GoodsReceiptItemDto)
  items!: GoodsReceiptItemDto[];
}

export class PurchaseReturnItemDto {
  @ApiProperty() @IsString() productId!: string;
  @ApiProperty() @IsNumber() returnedQty!: number;
  @ApiProperty() @IsNumber() unitPrice!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
}

export class CreatePurchaseReturnDto {
  @ApiProperty() @IsString() purchaseOrderId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
  @ApiProperty({ type: [PurchaseReturnItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseReturnItemDto)
  items!: PurchaseReturnItemDto[];
}
