export interface UserStored
{
    _id: string;
    name: string;
    surname: string;
    email: string;
    login: string;
    dateOfBirth: string;
    country: string;
    roleType: RoleTypes;
}

export enum RoleTypes{
    GUEST_USER = 'GUEST',
    REGISTERED_USER = 'USER',
    ADMIN = 'ADMIN'
}