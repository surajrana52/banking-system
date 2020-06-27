import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}
