import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}
