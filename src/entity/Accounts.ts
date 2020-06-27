import {Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import Clients from "./Clients";
import AccountStatus from "./AccountStatus";
import Transactions from "./Transactions";
import AccountType from "./AccountType";

@Entity({ name: "accounts" })
export default class Accounts {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    accNumber: string;

    @Column("decimal", { precision: 5, scale: 2 })
    balance: number;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column({name: 'account_type_id'})
    accountTypeId: number;

    @Column({name: 'account_status_id'})
    accountStatusId: number;

    @OneToOne(type => Clients, client => client.account)
    client: Clients;

    @ManyToOne(Type => AccountStatus, accountStatus => accountStatus.account)
    @JoinColumn({ name: "account_status_id"})
    accountStatus: AccountStatus;

    @ManyToOne(Type => AccountType, accountType => accountType.account)
    @JoinColumn({ name: "account_type_id"})
    accountType: AccountType;

    @OneToMany( Type => Transactions, transactions => transactions.account)
    transactions: Transactions[];

}
