import { IsString, IsOptional, IsIn, IsBoolean } from "class-validator";

export class UpdateShopUserDto {
  @IsString()
  @IsOptional()
  @IsIn(["OWNER", "MANAGER", "STAFF", "CASHIER"])
  role?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
