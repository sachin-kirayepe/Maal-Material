import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  MaxLength,
  IsIn,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateShopAddressDto {
  @IsString()
  @IsNotEmpty()
  addressLine!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsNotEmpty()
  pincode!: string;

  @IsString()
  @IsOptional()
  country?: string = "India";

  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;
}

export class CreateShopDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  slug!: string;

  @IsString()
  @IsOptional()
  @IsIn(["HARDWARE", "ELECTRICAL", "PAINT", "PLUMBING", "INDUSTRIAL_SUPPLY"])
  businessType?: string = "HARDWARE";

  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(15)
  gstin?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  ownerName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  marketplaceVisibility?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateShopAddressDto)
  address?: CreateShopAddressDto;
}
