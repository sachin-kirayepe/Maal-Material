import { IsString, IsOptional, IsNumber, IsDateString, IsEnum } from "class-validator";

export class CreateSiteTransferDto {
  @IsString()
  fromWarehouseId!: string;

  @IsString()
  toSiteId!: string;

  @IsString()
  productId!: string;

  @IsNumber()
  quantity!: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ReceiveSiteTransferDto {
  @IsNumber()
  @IsOptional()
  receivedQuantity?: number; // Partial receipt support

  @IsString()
  @IsOptional()
  notes?: string;
}

export class RecordConsumptionDto {
  @IsString()
  siteId!: string;

  @IsString()
  productId!: string;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  @IsOptional()
  wastageQty?: number;

  @IsString()
  @IsOptional()
  @IsEnum(["USAGE", "WASTAGE", "RETURNED"])
  consumptionType?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ConsumptionQueryDto {
  @IsString()
  @IsOptional()
  siteId?: string;

  @IsString()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsOptional()
  consumptionType?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
