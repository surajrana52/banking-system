import {MigrationInterface, QueryRunner} from "typeorm";
import faker from "faker";
import Clients from "../entity/Clients";
import bcrypt from "bcryptjs";

export class seedClientTable1593327586990 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        let users = [];

        for (let i = 0; i < 5; i++) {
            users.push({
                fullName: faker.name.firstName()+ ' '+ faker.name.lastName(),
                email: faker.internet.email(),
                password: await bcrypt.hash("123456", 10),
                verificationOtp: (Math.floor(Math.random() * 9000) + 1000).toString(),
                accountsId: i+1
            });
        }

        await queryRunner.manager
            .getRepository(Clients)
            .createQueryBuilder()
            .insert()
            .values(users)
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
