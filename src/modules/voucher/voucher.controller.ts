import { Controller, Get, Query, Post, Body, HttpStatus, HttpCode, ValidationPipe, BadRequestException, DefaultValuePipe, ParseIntPipe, } from "@nestjs/common";
import { VoucherService } from "./voucher.service";
import { ValidateVoucherDto } from "./dto/validate-voucher.dto";
import { CreateVoucherDto } from "./dto/create-voucher.dto";
import { Voucher } from "./entities/voucher.entity";
import { SpecialOfferService } from "../special-offer/special-offer.service";
@Controller('vouchers')
export class VoucherController {
    constructor(
        private readonly voucherService: VoucherService,
        private readonly specialOfferService: SpecialOfferService
    ) { }

    @Get()
    async getVouchers(
        @Query('email', new DefaultValuePipe('')) email: string,
        @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe('10'), ParseIntPipe) limit: number
    ): Promise<Voucher[]> {
        if (!email) {
            throw new BadRequestException('Email is required');
        }
        const pageNumber = Math.max(1, Number(page) || 1);
        const limitNumber = Math.max(1, Number(limit) || 10);

        return await this.voucherService.getVoucherByEmail(email, pageNumber, limitNumber);
    }

    @Post('validate')
    @HttpCode(HttpStatus.OK)
    async validateVoucher(
        @Body(ValidationPipe) validateVoucherDto: ValidateVoucherDto
    ) {
        return await this.voucherService.validateVoucher(
            validateVoucherDto.voucherCode,
            validateVoucherDto.email
        );
    }

    @Post('generate')
    async generateVouchers(
        @Body(ValidationPipe) createVoucherDto: CreateVoucherDto
    ) {
        const specialOffer = await this.specialOfferService.getOfferById(createVoucherDto.specialOfferId);
        if (!specialOffer) throw new BadRequestException('Special offer not found');

        await this.voucherService.generateVouchersForAllCustomers(
            createVoucherDto.specialOfferId,
            new Date(createVoucherDto.expirationDate)
        );
        return { message: "Vouchers generated successfully" };
    }
}
