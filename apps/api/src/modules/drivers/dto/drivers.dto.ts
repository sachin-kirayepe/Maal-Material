import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber } from "class-validator";

export class CreateDriverDto {
  @IsString()
  name!: string;

  @IsString()
  mobile!: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  licenseNumber!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateDriverDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  mobile?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateDriverAvailabilityDto {
  @IsString()
  @IsEnum(["AVAILABLE", "ON_DELIVERY", "OFF_DUTY", "INACTIVE"])
  availabilityStatus!: string;
}

export class DriverQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  availabilityStatus?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
