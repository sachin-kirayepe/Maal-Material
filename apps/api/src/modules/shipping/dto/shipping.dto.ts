import { IsString, IsOptional, IsNumber, IsBoolean } from "class-validator";

export class CreateShippingZoneDto {
  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @IsString()
  @IsOptional()
  cities?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsNumber()
  @IsOptional()
  baseCost?: number;

  @IsNumber()
  @IsOptional()
  perKmCost?: number;

  @IsNumber()
  @IsOptional()
  estimatedDays?: number;
}

export class UpdateShippingZoneDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  cities?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsNumber()
  @IsOptional()
  baseCost?: number;

  @IsNumber()
  @IsOptional()
  perKmCost?: number;

  @IsNumber()
  @IsOptional()
  estimatedDays?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
