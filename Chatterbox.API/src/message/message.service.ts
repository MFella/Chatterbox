import { BadGatewayException, BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { createQueryBuilder, Not, Repository } from "typeorm";
import { ChatMessageToCreateDto } from "./dtos/chatMessageToCreate.dto";
import { MessageToCreateDto } from "./dtos/messageToCreate.dto";
import { MessageToReturnDto } from "./dtos/messageToReturn.dto";
import { PerformInvitationMessageDto } from "./dtos/performInvitationMessage.dto";
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

            console.log(messageToCreateDto);

            if(messageToCreateDto.typeOfMessage === TypeOfMessage.INVITATION || messageToCreateDto.typeOfMessage === TypeOfMessage.DELETION)
            {
                const hipoInvitationFromRepo = await this.messageRepo
                .findOne({receiverId: messageToCreateDto.receiverId, senderId, typeOfMessage: messageToCreateDto.typeOfMessage});
                if(hipoInvitationFromRepo)
                {
                    throw new BadRequestException(`${messageToCreateDto.typeOfMessage} has been sent ealier. Pay attention`);
                }
            }

            if(!senderFromRepo || !receiverFromRepo)
            {
                throw new NotFoundException('Cant send message - invalid id of sender/receiver');
            }

            if(messageToCreateDto.typeOfMessage === TypeOfMessage.INVITATION &&(senderFromRepo.friends.indexOf(messageToCreateDto.receiverId) !== -1 || 
            receiverFromRepo.friends.indexOf(senderId) !== -1))
            {
                throw new BadRequestException('You are already friends!');
            }


            await this.messageRepo.save({...messageToCreateDto, senderId, creationDate: new Date()});

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

    async createMessageForPrivateChat(messageToCreateDto: ChatMessageToCreateDto): Promise<void>{

        try {
            const senderFromRepo = await this.usersRepo.findOne(messageToCreateDto.senderId);
            const receiverFromRepo = await this.usersRepo.findOne(messageToCreateDto.receiverId);


            

        }catch(e) {

        }
    }

    async getMessages(userId: string): Promise<MessageToReturnDto[]>
    {
        try{
            const messages = await this.messageRepo.find({receiverId: userId});

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

    async performInvitation(userId: string, performInvitationMessageDto: PerformInvitationMessageDto): Promise<boolean | HttpException>
    {

        try{
            const messageFromRepo = await this.messageRepo.findOne(performInvitationMessageDto.messageId);

            if(!messageFromRepo)
            {
                throw new NotFoundException('Cannot find that message');
            }

            const senderFromRepo = await this.usersRepo.findOne(messageFromRepo.senderId);

            if(!senderFromRepo)
            {
                throw new NotFoundException('Cannot find sender');
            }

            const userFromRepo = await this.usersRepo.findOne(userId);
   

            if(!userFromRepo)
            {
                throw new NotFoundException('Cannot find user');
            }


            switch(performInvitationMessageDto.action)
            {
                case 'ACCEPT':
                    userFromRepo.friends.push(messageFromRepo.senderId);
                    senderFromRepo.friends.push(userId);
                    await this.usersRepo.update(userId, userFromRepo);
                    await this.usersRepo.update(senderFromRepo._id, senderFromRepo);
                    await this.messageRepo.delete(performInvitationMessageDto.messageId);
                    return true;
                case 'DECLINE':
                    await this.messageRepo.delete(performInvitationMessageDto.messageId);
                    return true;
                default:
                    return false;
            }
        }catch(e)
        {
            if(e?.status)
            {
                throw new HttpException(e?.message, e.status);
            }else throw new InternalServerErrorException('Error occured during perfoming action - my bad');
        }



    }

    async getAllUsers(userId: string): Promise<User[]>
    {
        try{
            const users = (await this.usersRepo.find({select: ['login', 'name', 'surname']})).filter(el => el._id.toString() !== userId);
            console.log(users);
            return users;
        }catch(e)
        {
            throw new InternalServerErrorException('Error occured during fetching users');
        }
    }
}