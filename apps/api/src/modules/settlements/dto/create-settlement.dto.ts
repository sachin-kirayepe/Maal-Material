import { IsString, IsNumber, IsOptional } from "class-validator";

export class CreateSettlementDto {
  @IsString()
  customerId!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  paymentMethod!: string;

  @IsOptional()
  @IsString()
  referenceId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
