export interface MessageToRoomDto
{
    roomId: string;
    nickname: string;
    message: string;
    action: TYPE_OF_ACTION.MESSAGE | TYPE_OF_ACTION.JOIN | TYPE_OF_ACTION.LEAVE;
    performAt: Date;
}

export enum TYPE_OF_ACTION{ MESSAGE = "MESSAGE", JOIN = "JOIN", LEAVE="LEAVE"}