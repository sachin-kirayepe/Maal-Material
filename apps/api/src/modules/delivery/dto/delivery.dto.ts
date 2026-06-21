import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  IsEnum,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";

export class DeliveryItemDto {
  @IsString()
  productId!: string;

  @IsString()
  productName!: string;

  @IsString()
  @IsOptional()
  orderItemId?: string;

  @IsNumber()
  quantity!: number;
}

export class CreateDeliveryDto {
  @IsString()
  orderId!: string;

  @IsString()
  @IsOptional()
  fulfillmentId?: string;

  @IsString()
  customerId!: string;

  @IsString()
  @IsOptional()
  warehouseId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliveryItemDto)
  items!: DeliveryItemDto[];

  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @IsString()
  @IsOptional()
  shippingCity?: string;

  @IsString()
  @IsOptional()
  shippingState?: string;

  @IsString()
  @IsOptional()
  shippingPincode?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  deliveryNotes?: string;
}

export class AssignDeliveryDto {
  @IsString()
  driverId!: string;

  @IsString()
  vehicleId!: string;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;
}

export class UpdateDeliveryStatusDto {
  @IsString()
  @IsEnum([
    "PENDING",
    "ASSIGNED",
    "DISPATCHED",
    "PICKED_UP",
    "IN_TRANSIT",
    "DELIVERED",
    "FAILED",
    "RETURNED",
  ])
  status!: string;

  @IsString()
  @IsOptional()
  reason?: string; // used for FAILED or RETURNED

  @IsString()
  @IsOptional()
  location?: string;
}

export class DeliveryProofDto {
  @IsString()
  recipientName!: string;

  @IsString()
  @IsOptional()
  recipientSignature?: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class DeliveryQueryDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  driverId?: string;

  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
