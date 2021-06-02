import { BeforeInsert, Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class Message
{
    @ObjectIdColumn()
    _id: ObjectID;

    @Column({
        nullable: false
    })
    senderId: string;

    @Column({
        nullable: false
    })
    receiverId: string;

    @Column({
        nullable: false
    })
    typeOfMessage: TypeOfMessage;

    @Column({
        nullable: false
    })
    creationDate: Date;

    @Column({
        nullable: false
    })
    title: string;

    @Column({
        nullable: false
    })
    content: string;

    // @BeforeInsert()
    // createDate() {
    //     let now = new Date().toISOString().split('T');
    //     this.creationDate = now[0] + ' ' + now[1].split('.')[0];
    // }
}

export enum TypeOfMessage {
    NORMAL_MESSAGE = "NORMAL_MESSAGE",
    INVITATION = "INVITATION",
    DELETION  = "DELETION"
}