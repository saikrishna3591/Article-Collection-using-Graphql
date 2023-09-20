import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';
import { CreateAdminInput } from './dto/create-admin.input';
import { UpdateAdminInput } from './dto/update-admin.input';
import { AuthService } from 'src/user/AuthService';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from 'src/user/guards/AuthGuard';
import { ArticleApproveInput } from 'src/user/dto/create-user.input';
import { Article, User } from 'src/user/entities/user.entity';

@Resolver(() => Admin)
export class AdminResolver {
  constructor(
    private readonly adminService: AdminService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Mutation(() => User)
  createAdmin(
    @Args('createAdminInput') createAdminInput: CreateAdminInput,
    @Context() ctx: any,
  ) {
    console.log(ctx.request.session.userId);
    return this.authService.adminsignup(
      createAdminInput.name,
      createAdminInput.email_Id,
      createAdminInput.password,
    );
  }

  @Mutation(() => Article)
  @UseGuards(AuthGuard)
  async approveArticle(
    @Args('articleApproveInput') articleApproveInput: ArticleApproveInput,
    @Context() ctx: any,
  ) {
    const id = ctx.request.session.userId;
    const user = await this.userService.findUserById(id);
    console.log('hi', user.role);
    if (user.role !== 'ADMIN') {
      throw new NotFoundException('You dont have access to create an article');
    }
    return this.userService.approveArticle(
      articleApproveInput.id,
      articleApproveInput.approved,
    );
  }

  @Query(() => [Admin], { name: 'admin' })
  findAll() {
    return this.adminService.findAll();
  }

  @Query(() => Admin, { name: 'admin' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.adminService.findOne(id);
  }

  @Mutation(() => Admin)
  updateAdmin(@Args('updateAdminInput') updateAdminInput: UpdateAdminInput) {
    return this.adminService.update(updateAdminInput.id, updateAdminInput);
  }

  @Mutation(() => Admin)
  removeAdmin(@Args('id', { type: () => Int }) id: number) {
    return this.adminService.remove(id);
  }
}
