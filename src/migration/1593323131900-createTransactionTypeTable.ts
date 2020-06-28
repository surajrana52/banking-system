import {MigrationInterface, QueryRunner} from "typeorm";

export class createTransactionTypeTable1593323131900 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS transaction_type (
          id INT NOT NULL AUTO_INCREMENT,
          type VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          PRIMARY KEY (id))
        ENGINE = InnoDB
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE transaction_type`);
    }

}
