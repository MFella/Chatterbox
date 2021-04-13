import { Logger, Module } from "@nestjs/common";
import { ChannelModule } from "./channel/channel.module";
import { Seeder } from "./seeder";

@Module({
    imports: [ChannelModule],
    providers: [Logger, Seeder]
})
export class SeederModule{}