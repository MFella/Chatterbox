import {BeforeInsert, BeforeUpdate, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

export enum RoleTypes{
    GUEST_USER = 'GUEST',
    REGISTERED_USER = 'USER',
    ADMIN = 'ADMIN'
}

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
    timeOfLogout?: Date;

    @Column({
        type: 'enum',
        nullable: false,
        default: RoleTypes.GUEST_USER
    })
    roleType: RoleTypes;

    @Column({
        nullable: false
    })
    ip: string;

    @Column({
        nullable: false,
        default: true,
        type: 'boolean'
    })
    isLoggedIn: boolean;

    @BeforeInsert()
    // @BeforeUpdate()
    updateIsLoggedIn()
    {
        this.isLoggedIn = true;
        //that one
        this.timeOfLogout.setHours(this.lastLogin.getHours() + 1)
        setTimeout(() =>
        {
            this.isLoggedIn = false;
        }, 1000);
    }
}

