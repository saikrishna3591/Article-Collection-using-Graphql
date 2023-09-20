import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  name?: string;

  @Field()
  email_Id: string;

  @Field()
  password: string;

  // @Field()
  // role?: string;
}

@InputType()
export class CreatArticleInput {
  @Field()
  title: string;

  @Field()
  description: string;

  // @Field()
  // approved?: boolean;

  // @Field()
  // user?: string;
}

@InputType()
export class CreatAdminInput {
  @Field()
  name?: string;

  @Field()
  email_Id: string;

  @Field()
  password: string;
}

@InputType()
export class SigninInput {
  @Field()
  email_Id: string;

  @Field()
  password: string;
}

@InputType()
export class ArticleApproveInput {
  @Field()
  id: number;

  @Field()
  approved: boolean;
}
