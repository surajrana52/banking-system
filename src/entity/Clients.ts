import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";
import Accounts from "./Accounts";

@Entity({ name: "clients" })
export default class Clients {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    refreshToken: string;

    @Column()
    verificationOtp: string;

    @Column()
    emailVerified: boolean;

    @Column()
    accepted: boolean;

    @Column()
    accountDeleted: boolean;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column({name: 'accounts_id'})
    accountsId: number

    @OneToOne(type => Accounts, account => account.client)
    @JoinColumn({name: 'accounts_id'})
    account: Accounts;
}
