import { IsString, IsOptional, IsNumber, IsDateString, IsEnum } from "class-validator";

export class CreateProjectDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  @IsEnum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "INFRASTRUCTURE"])
  projectType?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  expectedEndDate?: string;

  @IsNumber()
  @IsOptional()
  estimatedBudget?: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  pincode?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsEnum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"])
  projectStatus?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  expectedEndDate?: string;

  @IsDateString()
  @IsOptional()
  actualEndDate?: string;

  @IsNumber()
  @IsOptional()
  estimatedBudget?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreatePhaseDto {
  @IsString()
  name!: string;

  @IsNumber()
  @IsOptional()
  sequenceOrder?: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsOptional()
  estimatedCost?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ProjectQueryDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  type?: string;

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
