import {MigrationInterface, QueryRunner} from "typeorm";

export class createClientTable1593323676300 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS clients (
          id INT NOT NULL AUTO_INCREMENT,
          fullName VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          refreshToken VARCHAR(255) NULL,
          verificationOtp VARCHAR(5) NULL,
          emailVerified TINYINT(1) NOT NULL,
          accepted TINYINT(1) NOT NULL DEFAULT 0,
          accountDeleted TINYINT(1) NOT NULL DEFAULT 0,
          createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
          accounts_id INT UNSIGNED NOT NULL,
          PRIMARY KEY (id, accounts_id),
          INDEX fk_clients_accounts1_idx (accounts_id ASC),
          CONSTRAINT fk_clients_accounts1
            FOREIGN KEY (accounts_id)
            REFERENCES tentwenty_test.accounts (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION)
        ENGINE = InnoDB

        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
