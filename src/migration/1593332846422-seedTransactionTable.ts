import {MigrationInterface, QueryRunner} from "typeorm";
import Transactions, {DebitCredit} from "../entity/Transactions";
import faker from "faker";

export class seedTransactionTable1593332846422 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        let transactions = [];

        for (let i = 0; i < 1000; i++) {
            transactions.push({
                amount: (Math.floor(Math.random() * 9000) + 1000),
                creditDebit: (Math.random() > 0.5) ? DebitCredit.CREDIT : DebitCredit.DEBIT,
                transactionTypeId: Math.floor(Math.random() * 3) + 1,
                accountId: Math.floor(Math.random() * 5) + 1,
                createdAt: faker.date.between("2020-06-01", "2020-06-31")
            });
        }

        await queryRunner.manager
            .getRepository(Transactions)
            .createQueryBuilder()
            .insert()
            .values(transactions)
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {

    }

}
