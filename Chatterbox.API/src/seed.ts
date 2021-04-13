import { Logger } from "@nestjs/common";
import { NestApplicationContext, NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { ChannelModule } from "./channel/channel.module"
import { Seeder } from "./channel/seeder/seeder";
import { SeederModule } from "./channel/seeder/seeder.module";

async function bootstrap()
{

    //const app = await NestFactory.create(SeederModule);
    NestFactory.createApplicationContext(SeederModule)
    .then((app: NestApplicationContext) =>
    {
        const logger = app.get(Logger);
        const seeder = app.get(Seeder);
        console.log("XD");

        seeder.seed()
        .then(() =>
        {
            logger.debug(`Good job => Seeded!`);
        })
        .catch((err: Error) =>
        {
            logger.error(`Some error occured during seeding data ;/`);
            throw err;
        })
        .finally(() => app.close());
    })
    .catch((err: Error) =>
    {
        throw err;
    })
}
bootstrap();