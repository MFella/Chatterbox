export interface MessageToReturnDto
{
    _id: string;
    name: string;
    surname: string;
    login: string;
    senderId: string;
    receiverId: string;
    typeOfMessage: string;
    creationDate: Date;
    title: string;
    content: string;
}