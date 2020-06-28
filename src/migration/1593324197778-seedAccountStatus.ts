import {MigrationInterface, QueryRunner} from "typeorm";

export class seedAccountStatus1593324197778 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            INSERT INTO account_status (status, description) 
            VALUES 
            ('ACTIVE', 'client account is currently active.'),
            ('DORMANT', 'client account is currently not in active user.');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
