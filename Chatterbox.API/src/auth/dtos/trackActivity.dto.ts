import { IsString, Length, Matches } from "class-validator";
import { RoleTypes } from "../entities/activity.entity";


export class TrackActivityDto
{
    @IsString()
    @Matches(/^[a-zA-Z0-9_.-]*$/, {message: 'Bad pattern of login'})
    @Length(5, 40, {message: 'Bad length of login'})
    readonly login: string;

    @IsString()
    @Matches(/^[a-zA-Z0-9_.-]*$/, {message: 'Bad pattern of login'})
    @Length(5, 40, {message: 'Bad length of login'})
    readonly newLogin?: string;

    readonly roleType: RoleTypes;
}