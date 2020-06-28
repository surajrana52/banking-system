import {MigrationInterface, QueryRunner} from "typeorm";

export class createAccountTable1593323510655 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS accounts (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          accNumber VARCHAR(255) NULL,
          balance DOUBLE(10,2) NOT NULL DEFAULT 0.00,
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
          account_type_id INT NOT NULL,
          account_status_id INT NOT NULL,
          PRIMARY KEY (id, account_type_id, account_status_id),
          INDEX fk_accounts_account_type1_idx (account_type_id ASC),
          INDEX fk_accounts_account_status1_idx (account_status_id ASC),
          CONSTRAINT fk_accounts_account_type1
            FOREIGN KEY (account_type_id)
            REFERENCES tentwenty_test.account_type (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
          CONSTRAINT fk_accounts_account_status1
            FOREIGN KEY (account_status_id)
            REFERENCES tentwenty_test.account_status (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION)
        ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE accounts');
    }

}
