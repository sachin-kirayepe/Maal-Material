import { IsString, IsNotEmpty, IsOptional, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {
  @ApiProperty({ example: "SHOP_OWNER", description: "Unique name of the system role" })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9_]+$/, {
    message: "Role name must contain only uppercase letters, numbers, and underscores",
  })
  name!: string;

  @ApiProperty({
    example: "Owner of a retail merchant location",
    description: "Brief description of role capabilities",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreatePermissionDto {
  @ApiProperty({
    example: "inventory:create",
    description: "Unique key for action privilege (domain:action)",
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9_]+:[a-z0-9_*:]+$/, {
    message: "Permission action must follow 'domain:action' pattern (e.g. inventory:create)",
  })
  action!: string;

  @ApiProperty({
    example: "Allows creating items in inventory",
    description: "Brief summary of permission rights",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class AssignPermissionDto {
  @ApiProperty({
    example: "inventory:create",
    description: "The action of the permission to link or assign to the role",
  })
  @IsString()
  @IsNotEmpty()
  permissionAction!: string;
}
