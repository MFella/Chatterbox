import {ObjectID} from 'typeorm';
import { TypeOfMessage } from '../message.entity';

export class MessageToReturnDto
{
    _id: ObjectID;
    name: string;
    surname: string;
    login: string;
    senderId: string;
    receiverId: string;
    typeOfMessage: TypeOfMessage;
    creationDate: Date;
    title: string;
    content: string;
}