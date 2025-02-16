import { Repository } from "typeorm";
import { Voucher } from "./entities/voucher.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerService } from "../customer/customer.service";
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from "@nestjs/common";

export class VoucherService {
    constructor(
        @InjectRepository(Voucher)
        private voucherRepository: Repository<Voucher>,
        private customerService: CustomerService,
    ) { }

    async getVoucherByEmail(email: string, page: number, limit: number): Promise<Voucher[]> {
        //Need some optimization depends on the number of vouchers and number of customers
        //Using index on customer.email then use it in the query instead of inner join 
        return await this.voucherRepository.find({ where: { customer: { email }, usedAt: null }, skip: (page - 1) * limit, take: limit });
    }

    async validateVoucher(voucherCode: string, email: string): Promise<number> {
        //Advantages using transaction
        //Consistency: The database remains in a valid state even if multiple users try to redeem vouchers simultaneously.
        //Concurrency Handling: Prevents potential race conditions where two requests might attempt to redeem the same voucher simultaneously.
        return await this.voucherRepository.manager.transaction(async (manager) => {
            const voucher = await manager.findOne(Voucher, { where: { code: voucherCode, usedAt: null }, relations: ['customer', 'specialOffer'] });

            if (!voucher) throw new BadRequestException('Invalid voucher');
            if (voucher.customer.email !== email) throw new BadRequestException('Invalid voucher');

            voucher.usedAt = new Date();
            await manager.save(voucher);
            return voucher.specialOffer.percentage;
        });
    }

    async generateVouchersForAllCustomers(specialOfferId: number, expirationDate: Date): Promise<void> {
        const limit = 100;
        const customerNumber = await this.customerService.getCustomerNumber();
        const totalPages = Math.ceil(customerNumber / limit);

        for (let page = 1; page <= totalPages; page++) {
            const customersIds = await this.customerService.getAllCustomersIds(page, limit);

            const vouchers: Partial<Voucher>[] = customersIds.map(customerId => ({
                code: this.generateUniqueCode(),
                customerId,
                specialOfferId,
                expirationDate,
            }));

            try {
                await this.voucherRepository.save(vouchers);
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    //Duplicate voucher detected, regenerating codes.
                    for (const voucher of vouchers) {
                        let isSaved = false;
                        while (!isSaved) {
                            try {
                                voucher.code = this.generateUniqueCode();
                                await this.voucherRepository.save(voucher);
                                isSaved = true;
                            } catch (dupError) {
                                if (dupError.code !== 'ER_DUP_ENTRY') throw dupError;
                            }
                        }
                    }
                } else {
                    throw error;
                }
            }
        }
    }

    private generateUniqueCode(): string {
        const uuid = uuidv4().replace(/-/g, '').substring(0, 8);
        return parseInt(uuid, 16).toString(36).toUpperCase();
    }

}

