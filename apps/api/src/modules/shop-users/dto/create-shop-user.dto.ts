import { IsString, IsNotEmpty, IsIn } from "class-validator";

export class CreateShopUserDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(["OWNER", "MANAGER", "STAFF", "CASHIER"])
  role!: string;
}
