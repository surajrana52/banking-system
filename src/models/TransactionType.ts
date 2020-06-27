import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "transaction_type" })
export default class TransactionType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

    @Column()
    description: string;
}
