import { IsString, IsNumber, IsOptional, IsEnum } from "class-validator";
import { PaymentMethod } from "@constructos/types";

export class CreatePaymentDto {
  @IsString()
  customerId!: string;

  @IsString()
  invoiceId!: string;

  @IsNumber()
  amount!: number;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
