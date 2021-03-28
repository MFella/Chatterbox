import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";
import { UserForLoginDto } from "./dtos/userForLogin.dto";
import { UserToReturnDto } from "./dtos/userToReturn.dto";


export class LocalStrategy extends PassportStrategy(Strategy)
{
    constructor(private authService: AuthService){
        super();
    }


    async validate(userForLoginDto: UserForLoginDto): Promise<UnauthorizedException | UserToReturnDto | boolean>
    {
        const user = await this.authService.validateUser(userForLoginDto);
        if(!user)
        {
            throw new UnauthorizedException();
        }
        return user;
    }
}