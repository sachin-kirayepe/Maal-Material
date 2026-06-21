import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsEmail,
  MinLength,
  MaxLength,
} from "class-validator";
import { CustomerType } from "@constructos/types";

export class CreateCustomerDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(15)
  mobile!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  gstin?: string;

  @IsEnum(CustomerType)
  @IsOptional()
  customerType?: CustomerType;

  @IsNumber()
  @IsOptional()
  creditLimit?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
