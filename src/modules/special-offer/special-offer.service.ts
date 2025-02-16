import { Injectable } from '@nestjs/common';
import { SpecialOffer } from './entities/special-offer.entity';
import { CreateSpecialOfferDto } from './dto/create-special-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SpecialOfferService {
  constructor(
    @InjectRepository(SpecialOffer)
    private readonly offerRepository: Repository<SpecialOffer>,
  ) {}

  async createOffer(dto: CreateSpecialOfferDto): Promise<SpecialOffer> {
    const offer = this.offerRepository.create(dto);
    return this.offerRepository.save(offer);
  }

  async getOfferById(id: number): Promise<SpecialOffer | null> {
    return this.offerRepository.findOne({ where: { id } });
  }
} 