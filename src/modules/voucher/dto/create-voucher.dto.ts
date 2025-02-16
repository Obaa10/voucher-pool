import { IsDateString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateVoucherDto {
  @IsNotEmpty()
  @IsNumber()
  specialOfferId: number;

  @IsDateString()
  @IsNotEmpty()
  expirationDate: string;
}