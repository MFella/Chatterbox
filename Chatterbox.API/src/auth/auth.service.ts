import { BadRequestException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { UserForRegisterDto } from './dtos/userForRegister.dto';
import {Keccak} from 'sha3';
import { UserForLoginDto } from './dtos/userForLogin.dto';
import { UserToReturnDto } from './dtos/userToReturn.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstans } from './constans';
import { Activity, RoleTypes } from './entities/activity.entity';
import { TrackActivityDto } from './dtos/trackActivity.dto';
import { JwtVerificationDto } from './dtos/jwtVerification.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtServ: JwtService,
        @InjectRepository(Activity)
        private activeRepo: Repository<Activity>
    )
    {}

    async checkLoginAccess(login: string)
    {
        return !await this.userRepository.findOne({login: login});
    }

    async checkEmailAccess(email: string)
    {
        return !await this.userRepository.findOne({email});
    }

    async registerUser(userForRegisterDto: UserForRegisterDto)
    {

        const userByEmail = await this.userRepository.findOne({email: userForRegisterDto.email});
        const userByLogin = await this.userRepository.findOne({login: userForRegisterDto.login});


        if(userByEmail)
        {
            throw new BadRequestException('User with that email already exists!');
        }

        if(userByLogin)
        {
            throw new BadRequestException('User with that login already exists!');
        }

        if(userForRegisterDto.password.normalize() !== userForRegisterDto.repeatPassword.normalize())
        {
            throw new BadRequestException('Passwords doesnt match!');
        }


        try{

            const hash = new Keccak(256);

            hash.update(userForRegisterDto.password);

            let {repeatPassword, password, dateOfBirth, ...userDetails} = userForRegisterDto;
            let splittedDate = dateOfBirth.split('-').map(x => parseInt(x));

            let passHash = hash.digest();
            const userForCreationDto = {...userDetails, 
                password: passHash,
                dateOfBirth: new Date(splittedDate[0], splittedDate[1]-1, splittedDate[2]+1)
            };

            let result = await this.userRepository.save(userForCreationDto);

            return !!result;
        }
        catch(e)
        {
            throw new InternalServerErrorException('Error occured during creating new user');
        }
    }

    async validateUser(userForLoginDto: UserForLoginDto): Promise<UserToReturnDto>
    {
        const res = await this.userRepository.findOne({login: userForLoginDto.login});

        if(res)
        {
            const hash = new Keccak(256);
            hash.update(userForLoginDto.password);

            if(hash.digest().toString('hex').normalize() === res.password.toString('hex').normalize())
            {
                const {password,  ...rest} = res; 

                return rest;
            }

            //return false;
            throw new UnauthorizedException('User with that combination doesnt exist');

        } else throw new UnauthorizedException('User with that combination doesnt exist');
    }

    async loginUser(userForLoginDto: UserForLoginDto, ip: string)
    {
        const user = await this.validateUser(userForLoginDto);

        if(user)
        {
            const payload = {login: user.login, _id: user._id.toString()}
            const details = {
                access_token: this.jwtServ.sign(payload),
                expiresIn: jwtConstans.expiresIn,
                user
            };

            const active = await this.activeRepo.findOne({loginOrNick: user.login});
            let today = new Date();
            today.setHours(today.getHours() + 1);

            if(active)
            {
                const {lastLogin, ip, ...rest} = active;

                const toUpdate = Object.assign({},
                    {
                        ...rest,
                        lastLogin: new Date(),
                        isLoggedIn: true,
                        timeOfLogout: today,
                        ip
                    })
                await this.activeRepo.update(active._id, toUpdate)

            }else
            {

                const toCreate = Object.assign({},
                {
                    loginOrNick: user.login,
                    lastLogin: new Date(),
                    isLoggedIn: true,
                    timeOfLogout: today,
                    ip
                });

                await this.activeRepo.save(toCreate);
            }

            return details;

        }

    }

    async checkNameForRoom(login: string): Promise<boolean>
    {
        try{
            const userFromUsers = await this.userRepository.findOne({login: login});
            const userFromAct = await this.activeRepo.findOne({loginOrNick: login});

            if(userFromAct || userFromUsers)
            {
                return false;
            }

            return true;

        }
        catch(e)
        {
            //throw new HttpExeption()...
            return false;
        }
    }

    async trackLogout(login: string): Promise<boolean>
    {
        // maybe blacklist token? ... 
        console.log('jestem');
        try{
            const actUserFromRepo = await this.activeRepo.findOne({loginOrNick: login});

            if(actUserFromRepo)
            { 
                const{isLoggedIn, ...rest} = actUserFromRepo;  
                const toUpdate = Object.assign({}, {
                    ...rest,
                    isLoggedIn: false,
                    timeOfLogout: new Date()
                })
                await this.activeRepo.update({loginOrNick: login}, toUpdate);
                return true;
            }else
            {
                return false;
            }
        }catch(e)
        {
            return false;
        }
    }

    async trackActivity(trackActivityDto: TrackActivityDto, ip: any): Promise<boolean>
    {
        try{
            const actUserFromRepo = await this.activeRepo.findOne({loginOrNick: trackActivityDto.login});
            const userFromRepo = await this.userRepository.findOne({login: trackActivityDto.login});
            
            if(actUserFromRepo){
                const{isLoggedIn, ...rest} = actUserFromRepo;  
                const toUpdate = Object.assign({}, {
                    ...rest,
                    isLoggedIn: true,
                    lastLogin: new Date(),
                    loginOrNick: trackActivityDto.newLogin !== 'undefined'? trackActivityDto.newLogin: rest.loginOrNick
                });
                await this.activeRepo.update({ loginOrNick: trackActivityDto.login}, toUpdate);

                return true;
            }else{
                // create record of activity

                const toUpdate = Object.assign({}, {
                    isLoggedIn: true,
                    loginOrNick: trackActivityDto.newLogin !== 'undefined' ? trackActivityDto.newLogin : trackActivityDto.login,
                    lastLogin: new Date(),
                    roleType: trackActivityDto.roleType, //userFromRepo ? RoleTypes.REGISTERED_USER : RoleTypes.GUEST_USER,
                    ip
                })
                await this.activeRepo.save(toUpdate);

                return true;

            }

        }catch(e)
        {
            console.log(e);
            return false;
        }
    }

    async changeNick(changeNickDto: TrackActivityDto, newIp: any): Promise<boolean>
    {
        try{
            const userFromRepo = await this.userRepository.findOne({login: changeNickDto.login});
            const actFromRepo = await this.activeRepo.findOne({loginOrNick: changeNickDto.login});
            const posedLogin = await this.userRepository.findOne({login: changeNickDto.newLogin});

            if(posedLogin){
                return false;
            } 

            if(userFromRepo)
            {
                const {login, ...restFromUser} = userFromRepo;
                const {loginOrNick, ip, ...restFromAct} = actFromRepo;

                await this.userRepository.update({login: changeNickDto.login}, {login: changeNickDto.newLogin, ...restFromUser});
                await this.activeRepo.update({loginOrNick: changeNickDto.login}, {loginOrNick: changeNickDto.newLogin, ip: newIp, ...restFromAct});
                return true;
            }else
            {

                if(!actFromRepo)
                {
                    const toCreate = {
                        loginOrNick: changeNickDto.newLogin,
                        roleType: changeNickDto.roleType,
                        ip: newIp
                    };
                    await this.activeRepo.save(toCreate);
                    return true;
                }

                const {loginOrNick, ip, ...rest} = actFromRepo;
                
                await this.activeRepo.update({loginOrNick: changeNickDto.login}, {...rest, loginOrNick: changeNickDto.login, ip:newIp});
                return true;
            }
         }catch(e)
         {
            return false;
        }

    }

    async isTokenExpired(token: string | undefined)
    {

        try{
            if(token === undefined || !token)
            {
                return false;
            }
            const res: JwtVerificationDto = this.jwtServ.verify(token.replace('Bearer ', ''));
            console.log(res);

            if(res)
            {
                const isValid = await this.userRepository.findOne(res._id);
                if(!isValid)
                {
                    throw new HttpException('You are not allowed!', 400);
                }
                
                if(isValid.login !== res.login)
                {
                    throw new HttpException('User not found!', 404);
                }

                const isExpired = ((new Date().getTime() / 1000) - res.exp) < 0 ? true : false;

                return isExpired;
            }

            return false;
            
        }catch(e)
        {
            return false;
        }
    }

}
