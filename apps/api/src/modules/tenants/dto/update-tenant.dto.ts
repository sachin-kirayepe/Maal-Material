import { IsString, IsOptional, IsIn, MaxLength } from "class-validator";

export class UpdateTenantDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  domain?: string;

  @IsString()
  @IsOptional()
  @IsIn(["ACTIVE", "SUSPENDED", "PENDING"])
  status?: string;
}
