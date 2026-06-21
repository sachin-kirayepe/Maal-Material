import { IsString, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { OrderAddressDto } from "../../orders/dto/orders.dto";

export class CheckoutDto {
  @IsString()
  customerId!: string;

  @IsString()
  cartId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderAddressDto)
  shippingAddress?: OrderAddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderAddressDto)
  billingAddress?: OrderAddressDto;
}
