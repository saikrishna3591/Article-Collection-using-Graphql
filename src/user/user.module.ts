import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './AuthService';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    UserService,
    UserResolver,
    PrismaService,
    AuthService,
    JwtStrategy,
    JwtService,
  ],
  exports: [JwtService],
})
export class UserModule {}
