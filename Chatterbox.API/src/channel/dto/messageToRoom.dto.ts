export interface MessageToRoomDto 
{
    nickname: string;
    roomId: string;
    message: string;
    action: TYPE_OF_ACTION.MESSAGE | TYPE_OF_ACTION.ACTIVITY
}

export enum TYPE_OF_ACTION{MESSAGE="MESSAGE", ACTIVITY="ACTIVITY"}
