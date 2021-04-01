import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { ObjectID, Repository } from 'typeorm';
import { UserForRegisterDto } from './dtos/userForRegister.dto';
import {Keccak} from 'sha3';
import { UserForLoginDto } from './dtos/userForLogin.dto';
import { UserToReturnDto } from './dtos/userToReturn.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstans } from './constans';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly jwtServ: JwtService
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

    async loginUser(userForLoginDto: UserForLoginDto)
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
            return details;

        }

    }

}
