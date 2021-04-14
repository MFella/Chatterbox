import { BeforeInsert, BeforeUpdate, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class Activity
{
    @ObjectIdColumn()
    _id: ObjectID;

    @Column({
        nullable: false
    })
    loginOrNick: string;

    @Column({
        type: 'date',
        nullable: false
    })
    lastLogin: Date;

    @Column({
        type: 'date',
        nullable: false,
        default: new Date()
    })
    timeOfLogout: Date;

    @Column({
        nullable: false
    })
    ip: string;

    @Column({
        nullable: false,
        default: true
    })
    isLoggedIn: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    updateIsLoggedIn()
    {
        this.isLoggedIn = true;
        this.timeOfLogout.setDate(new Date().getDate() + 1);
    }
    
}