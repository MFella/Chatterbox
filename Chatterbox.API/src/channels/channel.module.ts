import {Module} from '@nestjs/common';
import { ChannelSeed } from './seeds/channel.seed';
import {CommandModule} from 'nestjs-command';
import { ChannelService } from './channel.service';
import { Channel } from './channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        CommandModule,
        TypeOrmModule.forFeature([Channel]), 
    ],
    providers: [ChannelSeed, ChannelService],
    exports: [ChannelSeed]
})
export class ChannelModule{}