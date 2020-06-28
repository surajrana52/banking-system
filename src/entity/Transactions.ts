import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import Accounts from "./Accounts";
import TransactionType from "./TransactionType";

export enum DebitCredit {
    DEBIT = "DEBIT",
    CREDIT = "CREDIT"
}

@Entity({ name: "transactions" })
export default class Transactions {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("decimal", { precision: 5, scale: 2 })
    amount: number;

    @Column()
    creditDebit: DebitCredit;

    @Column()
    createdAt: Date;

    @Column({name: "transaction_type_id"})
    transactionTypeId: number;

    @Column({name: "accounts_id"})
    accountId: number;

    @ManyToOne(Type => Accounts, account => account.transactions)
    @JoinColumn({ name: "accounts_id"})
    account: Accounts;

    @ManyToOne(Type => TransactionType, transactionType => transactionType.transactions)
    @JoinColumn({ name: "transaction_type_id"})
    transactionType: TransactionType;
}
