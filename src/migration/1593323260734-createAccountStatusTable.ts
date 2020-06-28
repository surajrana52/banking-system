import {MigrationInterface, QueryRunner} from "typeorm";

export class createAccountStatusTable1593323260734 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS account_status (
          id INT NOT NULL AUTO_INCREMENT,
          status VARCHAR(255) NULL,
          description VARCHAR(255) NULL,
          PRIMARY KEY (id))
        ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE account_status');
    }

}
