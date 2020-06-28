import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import Accounts from "./Accounts";

@Entity({ name: "account_type" })
export default class AccountType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

    @Column()
    description: string;

    @OneToMany(type => Accounts, account => account.accountStatus)
    account: Accounts[];
}
