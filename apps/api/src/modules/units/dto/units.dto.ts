import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUnitDto {
  @ApiProperty({ example: "Kilogram" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: "kg" })
  @IsString()
  @IsNotEmpty()
  abbreviation!: string;

  @ApiProperty({ example: "weight", required: false })
  @IsString()
  @IsOptional()
  unitType?: string;
}

export class UpdateUnitDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  abbreviation?: string;

  @IsString()
  @IsOptional()
  unitType?: string;
}
