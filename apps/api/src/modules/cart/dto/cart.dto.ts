import { IsString, IsNumber } from "class-validator";

export class AddToCartDto {
  @IsString()
  productId!: string;

  @IsNumber()
  quantity!: number;
}
