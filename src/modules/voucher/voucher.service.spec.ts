import { Test, TestingModule } from '@nestjs/testing';
import { VoucherService } from './voucher.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';
import { CustomerService } from '../customer/customer.service';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('VoucherService', () => {
  let service: VoucherService;
  let voucherRepository: Repository<Voucher>;
  let customerService: CustomerService;

  const mockVoucherRepository = {
    find: jest.fn(),
    save: jest.fn(),
    manager: {
      transaction: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    },
  };

  const mockCustomerService = {
    getCustomerNumber: jest.fn(),
    getAllCustomersIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherService,
        {
          provide: getRepositoryToken(Voucher),
          useValue: mockVoucherRepository,
        },
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    service = module.get<VoucherService>(VoucherService);
    voucherRepository = module.get<Repository<Voucher>>(getRepositoryToken(Voucher));
    customerService = module.get<CustomerService>(CustomerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getVoucherByEmail', () => {
    it('should return vouchers for a given email with pagination', async () => {
      const mockVouchers = [
        { id: 1, code: 'ABC123' },
        { id: 2, code: 'DEF456' },
      ];
      mockVoucherRepository.find.mockResolvedValue(mockVouchers);

      const result = await service.getVoucherByEmail('test@example.com', 1, 10);

      expect(result).toEqual(mockVouchers);
      expect(mockVoucherRepository.find).toHaveBeenCalledWith({
        where: { customer: { email: 'test@example.com' }, usedAt: null },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('validateVoucher', () => {
    it('should validate and mark voucher as used', async () => {
      const mockVoucher = {
        code: 'ABC123',
        customer: { email: 'test@example.com' },
        specialOffer: { percentage: 10 },
        usedAt: null,
      };

      mockVoucherRepository.manager.transaction.mockImplementation(async (cb) => {
        mockVoucherRepository.manager.findOne.mockResolvedValue(mockVoucher);
        return await cb(mockVoucherRepository.manager);
      });

      const result = await service.validateVoucher('ABC123', 'test@example.com');

      expect(result).toBe(10);
      expect(mockVoucherRepository.manager.findOne).toHaveBeenCalled();
      expect(mockVoucherRepository.manager.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid voucher code', async () => {
      mockVoucherRepository.manager.transaction.mockImplementation(async (cb) => {
        mockVoucherRepository.manager.findOne.mockResolvedValue(null);
        return await cb(mockVoucherRepository.manager);
      });

      await expect(service.validateVoucher('INVALID', 'test@example.com'))
        .rejects
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException for mismatched email', async () => {
      const mockVoucher = {
        code: 'ABC123',
        customer: { email: 'different@example.com' },
        specialOffer: { percentage: 10 },
        usedAt: null,
      };

      mockVoucherRepository.manager.transaction.mockImplementation(async (cb) => {
        mockVoucherRepository.manager.findOne.mockResolvedValue(mockVoucher);
        return await cb(mockVoucherRepository.manager);
      });

      await expect(service.validateVoucher('ABC123', 'test@example.com'))
        .rejects
        .toThrow(BadRequestException);
    });
  });

  describe('generateVouchersForAllCustomers', () => {
    it('should generate vouchers for all customers', async () => {
      mockCustomerService.getCustomerNumber.mockResolvedValue(150);
      mockCustomerService.getAllCustomersIds.mockResolvedValueOnce([1, 2, 3]);
      mockCustomerService.getAllCustomersIds.mockResolvedValueOnce([4, 5]);
      mockVoucherRepository.save.mockResolvedValue([]);

      const expirationDate = new Date();
      await service.generateVouchersForAllCustomers(1, expirationDate);

      expect(mockCustomerService.getCustomerNumber).toHaveBeenCalled();
      expect(mockCustomerService.getAllCustomersIds).toHaveBeenCalledTimes(2);
      expect(mockVoucherRepository.save).toHaveBeenCalledTimes(2);
    });

    it('should handle duplicate voucher codes', async () => {
      mockCustomerService.getCustomerNumber.mockResolvedValue(100);
      mockCustomerService.getAllCustomersIds.mockResolvedValue([1]);
      
      mockVoucherRepository.save
        .mockRejectedValueOnce({ code: 'ER_DUP_ENTRY' })
        .mockResolvedValueOnce([]);

      const expirationDate = new Date();
      await service.generateVouchersForAllCustomers(1, expirationDate);

      expect(mockVoucherRepository.save).toHaveBeenCalledTimes(2);
    });
  });

  describe('generateUniqueCode', () => {
    it('should generate a unique code with correct format', () => {
      const code = (service as any).generateUniqueCode();
      
      expect(typeof code).toBe('string');
      expect(code).toMatch(/^[A-Z0-9]+$/);
    });
  });
}); 