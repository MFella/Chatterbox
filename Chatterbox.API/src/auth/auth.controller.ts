import {Body, Controller, Get, HttpStatus, Post, Req, Res} from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { UserForRegisterDto } from './dtos/userForRegister.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authServ: AuthService
    )
    {}

    @Get('check-login')
    checkLoginAccess(): boolean
    {
        return true;
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

}