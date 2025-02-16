import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { SpecialOffer } from 'src/modules/special-offer/entities/special-offer.entity';
import { Voucher } from 'src/modules/voucher/entities/voucher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, SpecialOffer, Voucher]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule { } 