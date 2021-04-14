import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import {jwtConstans} from './constans';
import { JwtStrategy } from './jwt.strategy';
import { Activity } from './entities/activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Activity]), 
    PassportModule,
    JwtModule.register({
      secret: jwtConstans.secret,
      signOptions: {expiresIn: '1h'}
    }),
    PassportModule.register({})
  ],
  exports: [TypeOrmModule, AuthService],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
