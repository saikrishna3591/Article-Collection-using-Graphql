import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email_Id: string;

  @Field()
  password: string;
}

@ObjectType()
export class Article {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  approved?: boolean;
}
