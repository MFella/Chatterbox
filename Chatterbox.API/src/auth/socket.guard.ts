import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { WsException } from "@nestjs/websockets";
import { Observable } from "rxjs";
import { Socket } from "socket.io";
import { AuthService } from "./auth.service";

@Injectable()
export class SocketAuthGuard implements CanActivate{

    constructor(private authServ: AuthService){}

    async canActivate(
        context: ExecutionContext,
    ): Promise<any> {
        // const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];
        try {
            
            const smth = context.switchToWs().getClient<Socket>();
            const authToken = smth.handshake?.query?.authorization.toString().split(' ')[1];
            const verification: any = await this.authServ.retrieveUserFromToken(authToken);

            if(!verification) {
                return false;
            } 

            const userFromRepo = await this.authServ.getByLogin(verification?.login);

            if(userFromRepo) return true;

            return false;

        } catch (ex) {
          console.log(ex);
          return false;
        }
      }
}