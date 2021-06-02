import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

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
        nullable: false,
        default: new Date()
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
}

export enum TypeOfMessage {
    NORMAL_MESSAGE = "NORMAL_MESSAGE",
    INVITATION = "INVITATION",
    DELETION  = "DELETION"
}