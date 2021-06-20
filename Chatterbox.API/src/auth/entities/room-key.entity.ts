import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class RoomKey{

    @ObjectIdColumn()
    _id: ObjectID;

    @Column({
        nullable: false
    })
    clientsIds: ObjectID[];

    @Column({
        nullable: false
    })
    key: string;

}