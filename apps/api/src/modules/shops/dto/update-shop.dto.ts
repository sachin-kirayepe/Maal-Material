import { IsString, IsOptional, IsBoolean, MaxLength, IsIn } from "class-validator";

export class UpdateShopDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

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

  @IsString()
  @IsOptional()
  @IsIn(["ACTIVE", "INACTIVE", "ONBOARDING", "SUSPENDED"])
  operationalStatus?: string;

  @IsString()
  @IsOptional()
  @IsIn(["HARDWARE", "ELECTRICAL", "PAINT", "PLUMBING", "INDUSTRIAL_SUPPLY"])
  businessType?: string;

  @IsBoolean()
  @IsOptional()
  marketplaceVisibility?: boolean;
}

export class UpdateShopAddressDto {
  @IsString()
  @IsOptional()
  addressLine?: string;

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
  country?: string;

  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;
}

export class UpdateShopSettingsDto {
  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsBoolean()
  @IsOptional()
  taxIncludedInPrice?: boolean;

  @IsOptional()
  defaultTaxPercent?: number;

  @IsString()
  @IsOptional()
  invoicePrefix?: string;

  @IsBoolean()
  @IsOptional()
  allowOnlineOrders?: boolean;

  @IsBoolean()
  @IsOptional()
  autoApproveListings?: boolean;

  @IsString()
  @IsOptional()
  receiptHeader?: string;

  @IsString()
  @IsOptional()
  receiptFooter?: string;
}
