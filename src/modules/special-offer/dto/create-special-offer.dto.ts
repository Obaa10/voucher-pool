import { IsDateString, IsInt, IsPositive, IsString, Max, Min } from 'class-validator';

export class CreateSpecialOfferDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  @Max(100)
  percentage: number;

  @IsDateString()
  expirationDate: Date;
} 