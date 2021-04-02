import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github')
{
    constructor()
    {
        super({
            authorizationURL: null,
			tokenURL        : null,
			clientID        : null,
			clientSecret    : null,
			callbackURL     : null,
			scope           : null,
        })
    }

    async validatate(accessToken: string): Promise<any>
    {}
    
}