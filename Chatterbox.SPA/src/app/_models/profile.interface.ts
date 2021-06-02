export interface Profile{
    country: string;
    dateOfBirth: string;
    email: string;
    login: string;
    name: string;
    surname: string;
    _id: string;
    isFriends: IsFriend;
}

export enum IsFriend
{
    YES = 'YES',
    NO = 'NO',
    INV_PEND = 'INV_PEND'
}