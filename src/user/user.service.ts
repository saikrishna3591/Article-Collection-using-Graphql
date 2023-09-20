import { Injectable, Session } from '@nestjs/common';
import { CreateUserInput, CreatArticleInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { connect } from 'http2';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserInput: CreateUserInput) {
    console.log('service', createUserInput);
    return await this.prisma.user.create({
      data: {
        name: createUserInput.name,
        email_Id: createUserInput.email_Id,
        password: createUserInput.password,
      },
    });
  }

  async createAdmin(data: Prisma.UserCreateInput) {
    console.log('service', data);
    return await this.prisma.user.create({ data });
  }

  async createArticle(data: Prisma.ArticlesCreateInput) {
    return await this.prisma.articles.create({ data });
  }

  async approveArticle(id: number, approved: boolean) {
    return this.prisma.articles.update({
      where: { id },
      data: { approved: approved },
    });
  }
  //==============================================================

  async getAllUsers(): Promise<User[]> {
    const user = await this.prisma.user.findMany();
    console.log('service', user);
    return user;
  }

  getUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getAllArticles() {
    return await this.prisma.articles.findMany();
  }
  getArticlesByAuthor(id: number) {
    return this.prisma.articles.findMany({
      where: { author_Id: id },
    });
  }

  async getUnApprovedArticles() {
    return await this.prisma.articles.findMany({
      where: {
        approved: false,
      },
    });
  }

  async getapprovedArticles() {
    return this.prisma.articles.findMany({
      where: {
        approved: true,
      },
    });
  }

  findOne(email_Id: string) {
    return this.prisma.user.findUnique({ where: { email_Id } });
  }

  async findUserById(id: number) {
    console.log(id);
    if (!id) {
      return null;
    }
    return await this.prisma.user.findUnique({ where: { id } });
  }
  //===========================================================================
  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
