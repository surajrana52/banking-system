import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "account_status" })
export default class AccountStatus {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

    @Column()
    description: string;
}
