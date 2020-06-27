import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import Accounts from "./Accounts";

@Entity({ name: "account_status" })
export default class AccountStatus {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

    @Column()
    description: string;

    @OneToMany(type => Accounts, account => account.accountStatus)
    account: Accounts[];

}
