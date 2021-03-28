import { IsString, Length, Matches } from "class-validator";

export class UserForLoginDto
{
    @IsString()
    @Matches(/^[a-zA-Z0-9_.-]*$/, {message: 'Bad pattern of login'})
    @Length(5, 25, {message: 'Bad length of login'})
    readonly login: string;


    @IsString()
    @Length(8, 30, {message: 'Bad length of password'})
    @Matches(/^[\w\[\]`!@#$%\^&*()={}:;<>+'-]*$/, {message: 'Bad pattern of password'})
    readonly password: string;
}