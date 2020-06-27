import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}
