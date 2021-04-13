import { Injectable, Logger } from "@nestjs/common";
import { Channel } from "../channel.entity"
import { ChannelService } from "../channel.service"

@Injectable({})
export class Seeder 
{
    constructor(
        private readonly logger: Logger,
        private readonly channelServ: ChannelService
    ){}

    async seed()
    {
        await this.channels()
        .then((res: boolean) =>
        {
            Promise.resolve(res);
        })
        .catch((err: Error) =>
        {
            this.logger.error(`Some error occured during seeding channels:\n${err}`);
            Promise.reject(err);
        })
    }

    private async channels(): Promise<boolean | Error>
    {
        return await Promise.all(await this.channelServ.create())
        .then((createdChannels: Channel[]) =>
        {
            this.logger.verbose(`Number of channels created: 
            ${createdChannels.filter((nullOrCreated: null | Object) => { return nullOrCreated}).length }`);
            return Promise.resolve(true);
        })
        .catch((err: Error) =>  Promise.reject(err));

    }
}