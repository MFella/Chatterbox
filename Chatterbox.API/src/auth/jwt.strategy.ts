import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";
import {jwtConstans} from './constans';
import { UserForLoginDto } from "./dtos/userForLogin.dto";
import { UserToReturnDto } from "./dtos/userToReturn.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
    constructor(private readonly authService: AuthService)
    {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstans.secret,
            algorithms: ["HS256", "HS384"]
        })
    }

    async validate(userForLoginDto: UserForLoginDto): Promise<UserToReturnDto | boolean>
    {
        // console.log(userForLoginDto);
        // const user = await this.authService.validateUser(userForLoginDto);
        // if(!user)
        // {
        //     throw new UnauthorizedException();
        // }
        // return user;
        return this.authService.getByLogin(userForLoginDto.login);
    }
}