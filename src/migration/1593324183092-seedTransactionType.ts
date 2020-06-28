import {MigrationInterface, QueryRunner} from "typeorm";

export class seedTransactionType1593324183092 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            INSERT INTO transaction_type (type, description) 
            VALUES 
            ('WITHDRAWAL', 'User has made a withdrawal request.'),
            ('DEPOSIT', 'User made a deposit.'),
            ('DEPOSIT_STAFF', 'Staff made an deposit.')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
