import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialOffer } from './entities/special-offer.entity';
import { SpecialOfferService } from './special-offer.service';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialOffer])],
  providers: [SpecialOfferService],
  exports: [SpecialOfferService],
})
export class SpecialOfferModule {} 