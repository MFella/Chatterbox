import { BadGatewayException, BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { createQueryBuilder, Repository } from "typeorm";
import { MessageToCreateDto } from "./dtos/messageToCreate.dto";
import { MessageToReturnDto } from "./dtos/messageToReturn.dto";
import { Message, TypeOfMessage } from "./message.entity";

@Injectable()
export class MessageService{

    constructor(
        @InjectRepository(Message)
        private messageRepo: Repository<Message>,
        @InjectRepository(User)
        private usersRepo: Repository<User>
    )
    {}

    async createMessage(messageToCreateDto: MessageToCreateDto, senderId: string): Promise<boolean | HttpException>
    {
        try{
            const senderFromRepo = await this.usersRepo.findOne(senderId);
            const receiverFromRepo = await this.usersRepo.findOne(messageToCreateDto.receiverId);

            if(messageToCreateDto.typeOfMessage === TypeOfMessage.INVITATION || messageToCreateDto.typeOfMessage === TypeOfMessage.DELETION)
            {
                const hipoInvitationFromRepo = await this.messageRepo.findOne({receiverId: messageToCreateDto.receiverId, senderId});
                if(hipoInvitationFromRepo)
                {
                    throw new BadRequestException(`${messageToCreateDto.typeOfMessage} has been sent ealier. Pay attention`);
                }
            }

            if(!senderFromRepo || !receiverFromRepo)
            {
                throw new NotFoundException('Cant send message - invalid id of sender/receiver');
            }

            await this.messageRepo.save({...messageToCreateDto, senderId});

            return true;

        }catch(e)
        {
            console.log(e);
            if(e?.status)
            {
                throw new HttpException(e?.message, e.status);
            }

            throw new InternalServerErrorException("Error occured during saving message");
        }

    }

    async getMessages(userId: string): Promise<MessageToReturnDto[]>
    {
        try{
            const messages = await this.messageRepo.find({receiverId: userId});

            console.log(messages);
            const messagesWithAuthors = [];

            for(let item of messages)
            {
                let sender = await this.usersRepo.findOne(item.senderId);
                const {password, country, dateOfBirth, email, friends, ...rest} = sender;
                messagesWithAuthors.push({...rest, ...item});
            }

            return messagesWithAuthors;

        }catch(e)
        {
            throw new InternalServerErrorException("Error occured during retriving messages");
        }
    }

    async getAllUsers(): Promise<User[]>
    {
        try{
            const users = await this.usersRepo.find({select: ['login', 'name', 'surname']});
            return users;
        }catch(e)
        {
            throw new InternalServerErrorException('Error occured during fetching users');
        }
    }
}