import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "staff" })
export default class Staff {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

}
