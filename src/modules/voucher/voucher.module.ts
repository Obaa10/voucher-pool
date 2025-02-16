import { Module } from '@nestjs/common';
import { Voucher } from './entities/voucher.entity';
import { CustomerModule } from '../customer/customer.module';
import { SpecialOfferModule } from '../special-offer/special-offer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Voucher]),
    CustomerModule,
    SpecialOfferModule,
    CustomerModule
  ],
  providers: [VoucherService],
  controllers: [VoucherController],
})
export class VoucherModule { } 