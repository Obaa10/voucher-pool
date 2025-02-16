import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) { }

  async findOrCreate(email: string, name?: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { email } });
    if (customer) return customer;

    const newCustomer = this.customerRepository.create({
      email,
      name: name || email,
    });
    return this.customerRepository.save(newCustomer);
  }

  async createCustomer(dto: CreateCustomerDto): Promise<Customer> {
    return this.customerRepository.save(dto);
  }

  async getAllCustomersIds(page: number, limit: number): Promise<number[]> {
    const customers = await this.customerRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      select: ['id']
    });
    
    return customers.map(customer => customer.id);
  }

  async getCustomerNumber(): Promise<number> {
    return this.customerRepository.count();
  }
} 