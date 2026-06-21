import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean } from "class-validator";

export class CreateWorkerDto {
  @IsString()
  name!: string;

  @IsString()
  mobile!: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @IsEnum([
    "MASON",
    "ELECTRICIAN",
    "PLUMBER",
    "WELDER",
    "PAINTER",
    "HELPER",
    "SUPERVISOR",
    "CARPENTER",
    "FITTER",
  ])
  skillType?: string;

  @IsNumber()
  @IsOptional()
  dailyWage?: number;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  contractorName?: string;

  @IsString()
  @IsOptional()
  aadharNumber?: string;

  @IsString()
  @IsOptional()
  bankAccount?: string;

  @IsString()
  @IsOptional()
  ifscCode?: string;

  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateWorkerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @IsEnum([
    "MASON",
    "ELECTRICIAN",
    "PLUMBER",
    "WELDER",
    "PAINTER",
    "HELPER",
    "SUPERVISOR",
    "CARPENTER",
    "FITTER",
  ])
  skillType?: string;

  @IsNumber()
  @IsOptional()
  dailyWage?: number;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class WorkerQueryDto {
  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  skillType?: string;

  @IsString()
  @IsOptional()
  search?: string;

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
