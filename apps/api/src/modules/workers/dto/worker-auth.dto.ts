import { IsString, IsNotEmpty, Length, IsOptional } from "class-validator";

export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 15)
  mobile!: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  mobile!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp!: string;
}

export class SelfRegisterDto {
  @IsString()
  @IsNotEmpty()
  mobile!: string;

  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  skillType!: string;

  @IsString()
  @IsOptional()
  aadharNumber?: string;
}
