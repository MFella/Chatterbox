import {Binary, Column, Entity, ObjectID, ObjectIdColumn, PrimaryGeneratedColumn} from 'typeorm';


@Entity()
export class User
{
    @ObjectIdColumn()
    _id: ObjectID;

    @Column({
        nullable: false
    })
    name: string;
 
    @Column({
        nullable: false
    })
    surname: string;

    @Column({
        type: 'date',
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
        type: "binary",
        nullable: false
    })
    password: Buffer;

}