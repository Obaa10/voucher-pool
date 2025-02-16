import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateVouchers0001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'voucher',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'code', type: 'varchar', length: '255', isUnique: true },
          { name: 'expiration_date', type: 'timestamp' },
          { name: 'used_at', type: 'timestamp', isNullable: true },
          { name: 'customer_id', type: 'int' },
          { name: 'special_offer_id', type: 'int' },
          { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['customer_id'],
            referencedTableName: 'customer',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['special_offer_id'],
            referencedTableName: 'special_offer',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('voucher');
  }
} 