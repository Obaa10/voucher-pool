import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ValidateVoucherDto {
  @IsNotEmpty()
  @IsString()
  voucherCode: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
} 