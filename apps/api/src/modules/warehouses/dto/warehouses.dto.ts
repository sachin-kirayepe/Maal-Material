import { IsString, IsNotEmpty, IsOptional, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateWarehouseDto {
  @ApiProperty({ example: "Main Warehouse Gorakhpur" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: "WH-GKP-01" })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString() @IsOptional() address?: string;
  @IsString() @IsOptional() city?: string;
  @IsString() @IsOptional() state?: string;
  @IsString() @IsOptional() pincode?: string;
  @IsString() @IsOptional() phone?: string;
  @IsBoolean() @IsOptional() isPrimary?: boolean;
}

export class UpdateWarehouseDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() code?: string;
  @IsString() @IsOptional() address?: string;
  @IsString() @IsOptional() city?: string;
  @IsString() @IsOptional() state?: string;
  @IsString() @IsOptional() pincode?: string;
  @IsString() @IsOptional() phone?: string;
  @IsBoolean() @IsOptional() isActive?: boolean;
  @IsBoolean() @IsOptional() isPrimary?: boolean;
}
