import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index, JoinColumn } from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { SpecialOffer } from '../../special-offer/entities/special-offer.entity';

@Entity()
@Index('idx_voucher_code', ['code'])
@Index('idx_voucher_customer', ['customerId'])
@Index('idx_voucher_special_offer', ['specialOfferId'])
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  code: string;

  @Column()
  expirationDate: Date;

  @Column({ nullable: true })
  usedAt: Date;

  @Column({ nullable: true })
  customerId: number;

  @ManyToOne(() => Customer, { onDelete: 'CASCADE' }) //Prevent unnecessary JOINs,reducing query time
  customer: Customer;

  @Column()
  specialOfferId: number;

  @ManyToOne(() => SpecialOffer, { eager: false })
  specialOffer: SpecialOffer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 