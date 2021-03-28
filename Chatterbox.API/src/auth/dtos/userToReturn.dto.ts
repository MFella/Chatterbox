import { IsDate, IsEmail, IsNotEmpty, IsString, Length, Matches, IsISO8601 } from "class-validator";
import { ObjectID } from "typeorm";

export class UserToReturnDto
{
    readonly _id: ObjectID;
    readonly name: string;
    readonly surname: string;
    readonly dateOfBirth: Date;
    readonly country:string;
    readonly email: string
    readonly login: string

}
