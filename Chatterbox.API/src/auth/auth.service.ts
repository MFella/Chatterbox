import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { ObjectID, Repository } from 'typeorm';
import { UserForRegisterDto } from './dtos/userForRegister.dto';
import {Keccak} from 'sha3';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    )
    {}

    async registerUser(userForRegisterDto: UserForRegisterDto)
    {

        const userByEmail = await this.userRepository.findOne({email: userForRegisterDto.email});
        const userByLogin = await this.userRepository.findOne({login: userForRegisterDto.login});

        console.log(userByEmail);
        console.log(userByLogin);

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
            console.log(hash.digest());

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

}
