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

    @Column()
    debitCredit: DebitCredit;

    @Column()
    createdAt: Date;

    @ManyToOne(Type => Accounts, account => account.transactions)
    @JoinColumn({ name: "accounts_id"})
    public account: Accounts;

    @ManyToOne(Type => TransactionType, transactionType => transactionType.transactions)
    @JoinColumn({ name: "transaction_type_id"})
    public transactionType: TransactionType;
}
