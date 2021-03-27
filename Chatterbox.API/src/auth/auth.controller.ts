import {Controller, Get, Post, Req} from '@nestjs/common';
import { AuthService } from './auth.service';

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
    register(@Req() req): boolean | null
    {
        console.log(req.body);
        return true;
        //return this.authServ.registerUser();
    }

}