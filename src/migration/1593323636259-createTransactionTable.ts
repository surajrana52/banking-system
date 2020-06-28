import {MigrationInterface, QueryRunner} from "typeorm";

export class createTransactionTable1593323636259 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          amount DECIMAL(10,2) NOT NULL,
          creditDebit ENUM('CREDIT', 'DEBIT') NULL,
          createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
          transaction_type_id INT NOT NULL,
          accounts_id INT UNSIGNED NOT NULL,
          PRIMARY KEY (id, transaction_type_id, accounts_id),
          INDEX fk_transactions_transaction_type_idx (transaction_type_id ASC),
          INDEX fk_transactions_accounts1_idx (accounts_id ASC),
          CONSTRAINT fk_transactions_transaction_type
            FOREIGN KEY (transaction_type_id)
            REFERENCES tentwenty_test.transaction_type (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
          CONSTRAINT fk_transactions_accounts1
            FOREIGN KEY (accounts_id)
            REFERENCES tentwenty_test.accounts (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION)
        ENGINE = InnoDB;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE transactions');
    }

}
