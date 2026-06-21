import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsEmail,
  ValidateNested,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum SupplierType {
  WHOLESALE = "WHOLESALE",
  DISTRIBUTOR = "DISTRIBUTOR",
  MANUFACTURER = "MANUFACTURER",
  LOCAL_VENDOR = "LOCAL_VENDOR",
}

export enum PaymentTerms {
  IMMEDIATE = "IMMEDIATE",
  NET_15 = "NET_15",
  NET_30 = "NET_30",
  NET_45 = "NET_45",
  NET_60 = "NET_60",
  NET_90 = "NET_90",
}

export class CreateSupplierAddressDto {
  @ApiProperty() @IsString() addressLine!: string;
  @ApiProperty() @IsString() city!: string;
  @ApiProperty() @IsString() state!: string;
  @ApiProperty() @IsString() pincode!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isDefault?: boolean;
}

export class CreateSupplierDto {
  @ApiProperty() @IsString() name!: string;
  @ApiProperty() @IsString() mobile!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() companyName?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() gstin?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pan?: string;
  @ApiPropertyOptional() @IsOptional() @IsEnum(SupplierType) supplierType?: SupplierType;
  @ApiPropertyOptional() @IsOptional() @IsEnum(PaymentTerms) paymentTerms?: PaymentTerms;
  @ApiPropertyOptional() @IsOptional() @IsNumber() creditLimit?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;

  @ApiPropertyOptional({ type: [CreateSupplierAddressDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSupplierAddressDto)
  addresses?: CreateSupplierAddressDto[];
}

export class UpdateSupplierDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mobile?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() companyName?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() gstin?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pan?: string;
  @ApiPropertyOptional() @IsOptional() @IsEnum(SupplierType) supplierType?: SupplierType;
  @ApiPropertyOptional() @IsOptional() @IsEnum(PaymentTerms) paymentTerms?: PaymentTerms;
  @ApiPropertyOptional() @IsOptional() @IsNumber() creditLimit?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
