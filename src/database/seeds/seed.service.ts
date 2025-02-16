import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { SpecialOffer } from 'src/modules/special-offer/entities/special-offer.entity';
import { Voucher } from 'src/modules/voucher/entities/voucher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(SpecialOffer)
    private offerRepository: Repository<SpecialOffer>,
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,
  ) {}

  async seedTestData(): Promise<void> {
    // Clear existing data in reverse order of dependencies
    await this.voucherRepository.clear();
    await this.customerRepository.clear();
    await this.offerRepository.clear();

    // Add new test data
    const customer1 = await this.customerRepository.save({
      email: 'test1@example.com',
      name: 'Test Customer 1',
    });

    const customer2 = await this.customerRepository.save({
      email: 'test2@example.com',
      name: 'Test Customer 2',
    });

    const offer1 = await this.offerRepository.save({
      name: 'Summer Sale',
      percentage: 20,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    });

    await this.voucherRepository.save([
      {
        code: 'SUMMER20-1',
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        customer: customer1,
        specialOffer: offer1,
      },
      {
        code: 'SUMMER20-2',
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        customer: customer2,
        specialOffer: offer1,
      },
    ]);
  }

  async seed() {
    return this.seedTestData();
  }
} 