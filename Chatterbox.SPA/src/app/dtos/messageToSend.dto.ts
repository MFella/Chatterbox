export interface MessageToSendDto
{
    receiverId: string;
    typeOfMessage: string;
    title: string;
    content: string;
}

export enum TypeOfMessage
{
    NORMAL_MESSAGE = 'NORMAL_MESSAGE',
    INVITATION = 'INVITATION',
    DELETION = 'DELETION'
}