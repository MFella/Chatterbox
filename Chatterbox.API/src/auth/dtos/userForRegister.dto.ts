import { IsDate, IsEmail, IsNotEmpty, IsString, Length, Matches, IsISO8601 } from "class-validator";

export class UserForRegisterDto
{
    @IsNotEmpty()
    @Length(2,100)
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @Length(2,100)
    @IsString()
    readonly surname: string;

    @IsISO8601({}, {message: 'Invalid date'})
    readonly dateOfBirth: string;


    @IsNotEmpty()
    @IsString()
    @Length(4,100, {
        message: 'Invalid name of country'
    })
    readonly country:string;
    

    @IsEmail({}, {
        message: 'Invalid email'
    })
    readonly email: string


    @IsString()
    @Matches(/^[a-zA-Z0-9_.-]*$/, {message: 'Bad pattern of login'})
    @Length(5, 25, {message: 'Bad length of login'})
    readonly login: string

    @IsString()
    @Length(8, 30, {message: 'Bad length of password'})
    @Matches(/^[\w\[\]`!@#$%\^&*()={}:;<>+'-]*$/, {message: 'Bad pattern of password'})
    readonly password: string;

    @IsString()
    @Length(8, 30, {message: 'Bad length of password'})
    @Matches(/^[\w\[\]`!@#$%\^&*()={}:;<>+'-]*$/, {message: 'Bad pattern of password'})
    readonly repeatPassword: string;
}
