import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class ChatMessage {

    @ObjectIdColumn()
    _id: ObjectID;

    @Column({
        nullable: false
    })
    senderId: string;

    @Column({
        nullable: false
    })
    senderLogin: string;

    @Column({
        nullable: false
    })
    receiverId: string;

    @Column({
        nullable: false
    })
    receiverLogin: string;

    @Column({
        nullable: false
    })
    content: string;

    @Column({
        nullable: false
    })
    performAt: Date;
}