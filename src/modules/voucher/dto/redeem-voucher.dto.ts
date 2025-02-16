import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RedeemVoucherDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  code: string;
} 