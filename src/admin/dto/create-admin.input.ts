import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAdminInput {
  @Field()
  name: string;

  @Field()
  email_Id: string;

  @Field()
  password: string;
}
