import { Injectable } from "@nestjs/common";
import { ChannelService } from "../channel.service";
import {Command} from 'nestjs-command';
import {Channels} from './channels';
import { Channel } from "./channel.interface";


@Injectable()
export class ChannelSeed
{
    constructor(private readonly channelServ: ChannelService){}

    @Command({command: 'create:channel', describe: 'create a channels', autoExit: true})
    async create()
    {
        
        Channels.forEach(async(el: Channel) =>
        {
            await this.channelServ.create(el);
        })

    }
}