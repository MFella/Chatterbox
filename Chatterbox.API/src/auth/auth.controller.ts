import {Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Put, Query, Req, Res} from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { CheckEmailDto } from './dtos/checkEmail.dto';
import { CheckLoginDto } from './dtos/checkLogin.dto';
import { UserForLoginDto } from './dtos/userForLogin.dto';
import { UserForRegisterDto } from './dtos/userForRegister.dto';
import { UserToReturnDto } from './dtos/userToReturn.dto';
import {RealIP} from 'nestjs-real-ip';
import { TrackLogoutDto } from './dtos/trackLogout.dto';
import { TrackActivityDto } from './dtos/trackActivity.dto';
import { GetProfileDto } from './dtos/getProfile.dto';

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

    @Get('check-email')
    async checkEmailAccesss(@Query() query: CheckEmailDto): Promise<boolean>
    {
        return await this.authServ.checkEmailAccess(query.email);
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
    async login(@Body() userForLoginDto: UserForLoginDto, @Res() res, @RealIP() ip: string): Promise<void> 
    {
        const resp =  await this.authServ.loginUser(userForLoginDto, ip);
     
        if(res)
        {
            res.status(HttpStatus.OK).send({'result': true, 'msg': 'You have been logged in successfully', resp});

        }else 
        {
            res.status(HttpStatus.OK).send({'result': true, 'msg': 'Cant log in'});
        }           
    }

    @Get('track-logout')
    async trackLogout(@Query() query: TrackLogoutDto, @Res() res, @RealIP() ip: string)
    {   
        console.log(query)
        const result = await this.authServ.trackLogout(query.login);
        res.send({'res': result});
    }

    @Get('track-activity')
    async trackActivity(@Query() query: TrackActivityDto, @Res() res, @RealIP() ip: string)
    {
        console.log(query);
        const resp =  await this.authServ.trackActivity(query, ip);
        res.send({'res': resp});

    }

    @Get('check-nickname')
    async checkNickname(@Query() query: CheckLoginDto, @Res() res)
    {
        return await this.authServ.checkNameForRoom(query.login);
    }

    @Put('change-nick')
    async changeNick(@Body() changeNickDto: TrackActivityDto, @RealIP() ip: string)
    {
        return await this.authServ.changeNick(changeNickDto, ip);
    }

    @Get('is-token-expired')
    async isTokenExpired(@Headers() headers)
    {
        return await this.authServ.isTokenExpired(headers['authorization']);
    }
    
    @Get('profile')
    async getProfileDetails(@Query() query: GetProfileDto)
    {
       return await this.authServ.getProfileDeatails(query);
    }
}