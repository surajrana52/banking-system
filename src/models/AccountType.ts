import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "account_type" })
export default class AccountType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

    @Column()
    description: string;
}
