import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import process from 'process';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtTokenService: JwtService,
  ) {}

  async signup(name: string, email_Id: string, password: string) {
    console.log('AuthService', name, email_Id, password);
    //see if email in use
    const users = await this.userService.findOne(email_Id);
    if (users !== null) {
      throw new BadRequestException('email in use');
    }

    //Hash the users password
    //Generate a salt
    const salt = randomBytes(8).toString('hex');

    //Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    //create a new user and save it
    const user = await this.userService.create({
      name,
      email_Id,
      password: result,
    });

    return user;
    // return {
    //   access_token: this.jwtTokenService.sign({ user }),
    // };
  }

  async adminsignup(name: string, email_Id: string, password: string) {
    //see if email in use
    const users = await this.userService.findOne(email_Id);
    if (users !== null) {
      throw new BadRequestException('email in use');
    }

    //Hash the users password
    //Generate a salt
    const salt = randomBytes(8).toString('hex');

    //Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    //create a new user and save it
    const user = this.userService.createAdmin({
      name,
      email_Id,
      password: result,
      role: 'ADMIN',
    });

    // return  user
    return user;
  }

  async signin(email_Id: string, password: string) {
    const users = await this.userService.findOne(email_Id);
    if (!users.email_Id) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = users.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }
    return users;
    // return {
    //   access_token: this.jwtTokenService.sign({ users }),
    // };
  }
}
