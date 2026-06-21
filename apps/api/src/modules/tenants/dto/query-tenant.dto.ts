import { IsOptional, IsString, IsInt, Min, IsIn } from "class-validator";
import { Type } from "class-transformer";

export class QueryTenantDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(["ACTIVE", "SUSPENDED", "PENDING"])
  status?: string;

  @IsOptional()
  @IsString()
  @IsIn(["name", "createdAt", "updatedAt"])
  sortBy?: string = "createdAt";

  @IsOptional()
  @IsString()
  @IsIn(["asc", "desc"])
  sortOrder?: "asc" | "desc" = "desc";
}
