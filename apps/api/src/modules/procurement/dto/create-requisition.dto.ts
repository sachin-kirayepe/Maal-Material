import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class RequisitionItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateRequisitionDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequisitionItemDto)
  items: RequisitionItemDto[];

  @IsString()
  @IsOptional()
  justification?: string;
}
