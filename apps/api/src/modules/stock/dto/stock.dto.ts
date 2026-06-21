import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class StockInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  warehouseId!: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0.01)
  quantity!: number;

  @IsNumber() @Min(0) @IsOptional() unitCost?: number;
  @IsString() @IsOptional() referenceType?: string;
  @IsString() @IsOptional() referenceId?: string;
  @IsString() @IsOptional() notes?: string;
}

export class StockOutDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  warehouseId!: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0.01)
  quantity!: number;

  @IsString() @IsOptional() referenceType?: string;
  @IsString() @IsOptional() referenceId?: string;
  @IsString() @IsOptional() notes?: string;
}

export class StockTransferDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fromWarehouseId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  toWarehouseId!: string;

  @ApiProperty({ example: 25 })
  @IsNumber()
  @Min(0.01)
  quantity!: number;

  @IsString() @IsOptional() notes?: string;
}

export class StockAdjustmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  warehouseId!: string;

  @ApiProperty({ example: "RECOUNT" })
  @IsString()
  @IsNotEmpty()
  adjustmentType!: string;

  @ApiProperty({ example: 95 })
  @IsNumber()
  @Min(0)
  newQuantity!: number;

  @IsString() @IsOptional() reason?: string;
}

export class StockReservationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  warehouseId!: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0.01)
  quantity!: number;

  @ApiProperty({ example: "SALES_ORDER" })
  @IsString()
  @IsNotEmpty()
  referenceType!: string;

  @IsString() @IsOptional() referenceId?: string;
}
