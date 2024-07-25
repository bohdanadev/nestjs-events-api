import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class LoginInput {
  @ApiProperty()
  @Field()
  username: string;

  @ApiProperty()
  @Field()
  password: string;
}
