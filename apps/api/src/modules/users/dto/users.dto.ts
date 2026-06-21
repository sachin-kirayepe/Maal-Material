import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsBoolean,
  IsArray,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: "engineer@constructos.com", description: "Business email for sign-in" })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: "Admin123!",
    description: "Secure, bcrypt-bound user password",
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password!: string;

  @ApiProperty({ example: "Aarav", description: "First name of the user", required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: "Sharma", description: "Last name of the user", required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: ["CONTRACTOR"],
    description: "Roles assigned to the user",
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roleNames?: string[];
}

export class UpdateUserDto {
  @ApiProperty({
    example: "engineer@constructos.com",
    description: "User business email",
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: "NewSecurePassword123!",
    description: "New password",
    minLength: 8,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password?: string;

  @ApiProperty({ example: "Aarav", description: "First name of the user", required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: "Sharma", description: "Last name of the user", required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: true, description: "Whether the account is active", required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: ["CONTRACTOR"], description: "Updated roles list", required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roleNames?: string[];
}

export class AssignRoleDto {
  @ApiProperty({ example: "MANAGER", description: "The name of the role to assign to the user" })
  @IsString()
  @IsNotEmpty()
  roleName!: string;
}
