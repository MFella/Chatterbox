export interface MessageToSendDto
{
    typeOfMessage: string;
    receiver: string;
    subject: string;
    content: string;
}