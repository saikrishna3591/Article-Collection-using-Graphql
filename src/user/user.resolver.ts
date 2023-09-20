import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, Article } from './entities/user.entity';
import {
  CreateUserInput,
  CreatArticleInput,
  SigninInput,
  ArticleApproveInput,
} from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AuthService } from './AuthService';
import { NotFoundException, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/AuthGuard';
import { JwtAuthGuard } from './guards/jwt.AuthGuard';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  //==========================================================================
  @Query(() => [User])
  async users(@Context() ctx: any) {
    console.log(ctx.request.session.userId);
    const users = await this.userService.getAllUsers();
    console.log('resolver', users);
    return users;
  }

  @Query((returns) => User)
  user(@Args('id') id: string) {
    return this.userService.getUserById(parseInt(id));
  }

  @Query((returns) => User)
  signout(@Context() ctx: any) {
    console.log(ctx.request.session);
    const id = ctx.request.session.userId;
    ctx.request.session.userId = null;
    console.log(ctx.request.session);
    return this.userService.getUserById(id);
  }

  @Query((returns) => [Article])
  async articles() {
    const artcls = await this.userService.getAllArticles();
    console.log('resolver', artcls);
    return artcls;
  }

  @Query((returns) => [Article])
  async articlesByAuthorId(@Context() ctx: any) {
    const authid = ctx.request.session.userId;
    console.log(authid);
    const artclsById = await this.userService.getArticlesByAuthor(authid);
    console.log('resolver', artclsById);
    return artclsById;
  }

  @Query((returns) => [Article])
  async articlesById(@Args('id') id: number) {
    console.log(id);
    const artclsById = await this.userService.getArticlesByAuthor(id);
    console.log('resolver', artclsById);
    return artclsById;
  }

  @Query(() => [Article])
  async approvedArticle() {
    const unaprveAtcls = await this.userService.getapprovedArticles();
    console.log('resolver', unaprveAtcls);
    return unaprveAtcls;
  }

  @Query(() => [Article])
  async unApprovedArticle() {
    const unaprveAtcls = await this.userService.getUnApprovedArticles();
    console.log('resolver', unaprveAtcls);
    return unaprveAtcls;
  }
  //===========================================================================

  @Mutation(() => User)
  // @UseGuards(JwtAuthGuard)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @Context() ctx: any,
  ) {
    console.log('resolver', createUserInput);
    const { name, email_Id, password } = createUserInput;
    console.log(ctx.request.session.userId);
    return this.authService.signup(name, email_Id, password);
  }

  @Mutation(() => User)
  async signin(
    @Args('signInInput') signInInput: SigninInput,
    @Context() ctx: any,
  ) {
    const user = await this.authService.signin(
      signInInput.email_Id,
      signInInput.password,
    );
    console.log('resolver', user);
    console.log(ctx.request.session.userId);
    ctx.request.session.userId = user.id;
    console.log(ctx.request.session);
    return user;
  }

  @Mutation(() => Article)
  @UseGuards(AuthGuard)
  // @UseGuards(JwtAuthGuard)
  async createArticle(
    @Args('createArticleInput') createArticleInput: CreatArticleInput,
    @Context() ctx: any,
  ) {
    const id = ctx.request.session.userId;
    const user = await this.userService.findUserById(id);
    console.log('hi', user.role);
    if (user.role !== 'AUTHOR') {
      throw new NotFoundException('You dont have access to create an article');
    }
    const { title, description } = createArticleInput;
    return this.userService.createArticle({
      title,
      description,
      user: {
        connect: { id: user.id },
      },
    });
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
    if (user.role !== 'AUTHOR') {
      throw new NotFoundException('You dont have access to create an article');
    }
    return this.userService.approveArticle(
      articleApproveInput.id,
      articleApproveInput.approved,
    );
  }
  //======================================================

  // @Query()
  // @UseGuards(AdminGuard)
  // getArticles(@Args('approved') approved: String) {
  //   return this.userService.getUnApprovedArticles(approved);
  // }

  // @Query(() => Article, { name: 'article' })
  // findOne(@Args('author') author: string) {
  //   return this.userService.getArticlesByAuthor(author);
  // }

  //=======================================================================
  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }
}
