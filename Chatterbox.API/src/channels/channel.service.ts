import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Observable } from "rxjs";
import { getConnection, getConnectionManager, getRepository, Repository } from "typeorm";
import { Channel } from "./channel.entity";
import * as ChannelModel from "./seeds/channel.interface";

@Injectable()
export class ChannelService{

    constructor(
        @InjectRepository(Channel)
        private readonly channelRepo: Repository<Channel>
    ){
        this.channelRepo = getRepository(Channel);
    }

    async create(channel: ChannelModel.Channel): Promise<boolean>
    {
        const manager = getConnectionManager().get("default");
        const repo = getConnection('default').getRepository(Channel);
        console.log("OSTRO")
        const result = await repo.save(channel);
        console.log(result);
        return !!result;
    }
}