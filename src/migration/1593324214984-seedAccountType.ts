import {MigrationInterface, QueryRunner} from "typeorm";

export class seedAccountType1593324214984 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            INSERT INTO account_type (type, description) 
            VALUES 
            ('SAVING', 'client is holding a savings account'),
            ('CURRENT', 'client is holding a current account');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
