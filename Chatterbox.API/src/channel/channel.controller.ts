import { Controller, Get} from "@nestjs/common";
import { ChannelService } from "./channel.service";
import { Channel } from "./dto/channel.interface";


@Controller('channel')
export class ChannelController {

    constructor(
        private readonly channelServ: ChannelService
    )
    {}

        @Get('list')
        async getRoomList(): Promise<Channel[]>
        {
            return await this.channelServ.getRoomList();
        }

 }
