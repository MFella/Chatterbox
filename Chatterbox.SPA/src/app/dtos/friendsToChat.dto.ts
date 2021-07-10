import { KeyToUserChatDto } from "./keyToUserChatDto";

export interface FriendsToChatDto
{
    name: string;
    surname: string;
    _id: string;
    login: string;
    isFriend: boolean;
    key: KeyToUserChatDto
}