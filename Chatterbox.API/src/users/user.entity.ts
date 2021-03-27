import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';


@Entity()
export class User
{
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({
        nullable: false
    })
    name: string;

    @Column({
        nullable: false
    })
    surname: string;

    @Column({
        nullable: false
    })
    dateOfBirth: Date;

    @Column({
        nullable: false
    })
    country: string;

    @Column({
        nullable: false
    })
    email: string;

    @Column({
        nullable: false
    })
    login: string;

    @Column({
        type: "blob",
        nullable: false
    })
    password: Buffer;

}