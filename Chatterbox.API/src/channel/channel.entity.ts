import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class Channel
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
    limit: number;
}