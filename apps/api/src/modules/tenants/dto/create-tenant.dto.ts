import { IsString, IsOptional, IsNotEmpty, MaxLength } from "class-validator";

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  domain?: string;
}
