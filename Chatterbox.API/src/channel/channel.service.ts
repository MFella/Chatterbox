import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Channel } from "./channel.entity";
import * as ChannelModel from "./dto/channel.interface"
import {Channels} from './channels';

@Injectable()
export class ChannelService{

    constructor(
        @InjectRepository(Channel)
        private channelRepo: Repository<Channel>
    ){}


    async getRoomList(): Promise<Channel[]>
    {
        return await this.channelRepo.find({});
    }

    async create(): Promise<Promise<Channel>[]>
    {
        return Channels.map(async(channel: ChannelModel.Channel) =>
        {
            return await this.channelRepo
            .findOne({name: channel.name})
            .then(async(channelFromDb: Channel) =>
            {
                if(channelFromDb) return Promise.resolve(null);

                return Promise.resolve(
                    await this.channelRepo.save(channel),
                );
            })
            .catch((err: any) => Promise.reject(err))
        })
    }
}