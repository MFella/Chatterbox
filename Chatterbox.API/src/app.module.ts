import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/roles/roles.guard';
import { ChannelModule } from "./channel/channel.module"
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    TypeOrmModule.forRoot(), 
    AuthModule,
    ChannelModule,
    MessageModule
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway,
  {
    provide: APP_GUARD, useClass: RolesGuard
  }],
})
export class AppModule {}
