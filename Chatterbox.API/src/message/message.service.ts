import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { createQueryBuilder, Repository } from "typeorm";
import { MessageToCreateDto } from "./dtos/messageToCreate.dto";
import { MessageToReturnDto } from "./dtos/messageToReturn.dto";
import { Message } from "./message.entity";

@Injectable()
export class MessageService{

    constructor(
        @InjectRepository(Message)
        private messageRepo: Repository<Message>,
        @InjectRepository(User)
        private usersRepo: Repository<User>
    )
    {}

    async createMessage(messageToCreateDto: MessageToCreateDto)
    {
        try{
            const senderFromRepo = await this.usersRepo.findOne(messageToCreateDto.senderId);
            const receiverFromRepo = await this.usersRepo.findOne(messageToCreateDto.receiverId);

            if(!senderFromRepo || !receiverFromRepo)
            {
                throw new NotFoundException('Cant send message - invalid id of sender/receiver');
            }

            await this.messageRepo.save(messageToCreateDto);

        }catch(e)
        {
            throw new InternalServerErrorException("Error occured during saving message");
        }

    }

    async getMessages(userId: string): Promise<MessageToReturnDto[]>
    {
        try{
            const messages = await this.messageRepo.find({receiverId: userId});

            const messagesWithAuthors = [];
            messages.forEach(async(el: Message) => {
                let sender = await this.usersRepo.findOne(el.senderId);
                const {password, country, dateOfBirth, ...rest} = sender;
                messagesWithAuthors.push({...rest, ...el});
            });

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