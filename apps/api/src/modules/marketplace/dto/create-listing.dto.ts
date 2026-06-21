import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  shopId!: string;

  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsString()
  @IsNotEmpty()
  marketplaceCategoryId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @IsOptional()
  regionalAvailability?: string;
}
