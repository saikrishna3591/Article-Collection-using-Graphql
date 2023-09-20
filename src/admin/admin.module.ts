import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/user/AuthService';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    AdminResolver,
    AdminService,
    PrismaService,
    AuthService,
    UserService,
    JwtService,
  ],
})
export class AdminModule {}
