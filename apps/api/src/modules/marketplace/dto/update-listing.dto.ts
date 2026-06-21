import { IsString, IsOptional, IsNumber, IsBoolean, Min } from "class-validator";
import { Type } from "class-transformer";

export class UpdateListingDto {
  @IsString()
  @IsOptional()
  marketplaceCategoryId?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsString()
  @IsOptional()
  regionalAvailability?: string;
}
