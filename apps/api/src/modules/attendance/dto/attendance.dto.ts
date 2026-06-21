import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class MarkAttendanceDto {
  @IsString()
  workerId!: string;

  @IsString()
  siteId!: string;

  @IsDateString()
  date!: string;

  @IsString()
  @IsOptional()
  @IsEnum(["FULL_DAY", "HALF_DAY", "OVERTIME", "NIGHT_SHIFT"])
  shiftType?: string;

  @IsNumber()
  @IsOptional()
  hoursWorked?: number;

  @IsNumber()
  @IsOptional()
  overtimeHours?: number;

  @IsString()
  @IsOptional()
  @IsEnum(["PRESENT", "ABSENT", "HALF_DAY", "LEAVE"])
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class BulkAttendanceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarkAttendanceDto)
  entries!: MarkAttendanceDto[];
}

export class AttendanceQueryDto {
  @IsString()
  @IsOptional()
  siteId?: string;

  @IsString()
  @IsOptional()
  workerId?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
