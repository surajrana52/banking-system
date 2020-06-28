import {MigrationInterface, QueryRunner} from "typeorm";

export class createAccountTypeTable1593323383183 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS account_type (
          id INT NOT NULL AUTO_INCREMENT,
          type VARCHAR(255) NOT NULL,
          description VARCHAR(255) NULL,
          PRIMARY KEY (id))
        ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE account_type');
    }

}
