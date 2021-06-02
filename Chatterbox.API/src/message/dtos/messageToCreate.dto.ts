import { TypeOfMessage } from "../message.entity";

export class MessageToCreateDto{

    // senderId: string;
    receiverId: string;
    typeOfMessage: TypeOfMessage;
    title: string;
    content: string;
}