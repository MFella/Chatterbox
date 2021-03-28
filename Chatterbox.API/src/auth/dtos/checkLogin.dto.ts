import { IsString, Length, Matches } from "class-validator";

export class CheckLoginDto
{
    @IsString()
    @Matches(/^[a-zA-Z0-9_.-]*$/, {message: 'Bad pattern of login'})
    @Length(5, 25, {message: 'Bad length of login'})
    readonly login: string;
}