import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber } from "class-validator";

export class CreateVehicleDto {
  @IsString()
  vehicleNumber!: string;

  @IsString()
  @IsEnum(["BIKE", "AUTO", "PICKUP", "MINI_TRUCK", "TRUCK"])
  type!: string;

  @IsString()
  @IsOptional()
  make?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateVehicleDto {
  @IsString()
  @IsOptional()
  vehicleNumber?: string;

  @IsString()
  @IsOptional()
  @IsEnum(["BIKE", "AUTO", "PICKUP", "MINI_TRUCK", "TRUCK"])
  type?: string;

  @IsString()
  @IsOptional()
  make?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateVehicleStatusDto {
  @IsString()
  @IsEnum(["ACTIVE", "MAINTENANCE", "RETIRED"])
  operationalStatus!: string;
}

export class VehicleQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  operationalStatus?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
