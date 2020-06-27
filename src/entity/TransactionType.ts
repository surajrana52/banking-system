import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import Accounts from "./Accounts";
import Transactions from "./Transactions";

@Entity({ name: "transaction_type" })
export default class TransactionType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    description: string;

    @OneToMany(type => Transactions, transactions => transactions.transactionType)
    transactions: Transactions[];
}
