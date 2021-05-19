import { RoleTypes } from "../_models/userStored.interface";

export interface ChangeNickDto
{
    login: string;
    newLogin: string;
    roleType: RoleTypes
}