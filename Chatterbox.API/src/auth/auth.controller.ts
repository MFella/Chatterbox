import {Body, Controller, Get, HttpStatus, Post, Query, Req, Res} from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { CheckLoginDto } from './dtos/checkLogin.dto';
import { UserForLoginDto } from './dtos/userForLogin.dto';
import { UserForRegisterDto } from './dtos/userForRegister.dto';
import { UserToReturnDto } from './dtos/userToReturn.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authServ: AuthService
    )
    {}

    @Get('check-login')
    async checkLoginAccess(@Query() query: CheckLoginDto): Promise<boolean>
    {
        return await this.authServ.checkLoginAccess(query.login);
    }

    @Post('register')
    async register(@Body() userForRegisterDto: UserForRegisterDto, @Res() res): Promise<boolean | User> | null
    {
        const result = await this.authServ.registerUser(userForRegisterDto);

        if(result)
        {
            res.status(HttpStatus.CREATED).send({'res': true, 'msg': 'User has been registered'});
        }else
        {
            res.status(HttpStatus.OK).send({'res': false, 'msg': 'Cant register that user'});
        }

        return result;
        //return this.authServ.registerUser();
    }

    @Post('login')
    async login(@Body() userForLoginDto: UserForLoginDto, @Res() res): Promise<void> 
    {
        const resp =  await this.authServ.loginUser(userForLoginDto);
     
        if(res)
        {
            res.status(HttpStatus.OK).send({'result': true, 'msg': 'You have been logged in successfully', resp});

        }else 
        {
            res.status(HttpStatus.OK).send({'result': true, 'msg': 'Cant log in'});
        }           


    }

}