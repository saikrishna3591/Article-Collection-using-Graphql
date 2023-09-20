import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserResolver } from './user/user.resolver';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AdminResolver } from './admin/admin.resolver';
import { AdminModule } from './admin/admin.module';
import { AdminService } from './admin/admin.service';
import { AuthService } from './user/AuthService';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport';
import { env } from 'process';
import { JwtStrategy } from './user/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    AdminModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),

      context: ({ req, res }) => ({
        request: req,
      }),
    }),
  ],
  controllers: [],
  providers: [
    UserService,
    UserResolver,
    PrismaService,
    AdminResolver,
    AdminService,
    AuthService,
    JwtStrategy,
  ],
})
export class AppModule {}
