import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot(), AuthModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
