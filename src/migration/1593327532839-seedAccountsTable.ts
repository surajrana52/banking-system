import {MigrationInterface, QueryRunner} from "typeorm";
import Accounts from "../entity/Accounts";

export class seedAccountsTable1593327532839 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        let accounts = [];

        for (let i = 0; i < 5; i++) {
            accounts.push({
                accNumber: (Math.floor(Math.random() * 900000) + 100000).toString(),
                balance: (Math.floor(Math.random() * 9000) + 1000),
                accountTypeId: Math.floor(Math.random() * 2) + 1,
                accountStatusId: Math.floor(Math.random() * 2) + 1
            });
        }

        await queryRunner.manager
            .getRepository(Accounts)
            .createQueryBuilder()
            .insert()
            .values(accounts).execute();

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
