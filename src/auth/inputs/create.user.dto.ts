import { IsEmail, Length } from "class-validator";
import { UserDoesNotExist } from '../validation/user-does-not-exist.constraint';
import { Field, InputType } from '@nestjs/graphql';
import { IsRepeated } from '../../validation/is-repeated.constraint';
import { ApiProperty } from "@nestjs/swagger";

@InputType('UserAddInput')
export class CreateUserDto {
  @ApiProperty()
  @Length(5)
  @UserDoesNotExist()
  @Field()
  username: string;

  @ApiProperty()
  @Length(8)
  @Field()
  password: string;

  @ApiProperty()
  @Length(8)
  @IsRepeated('password')
  @Field()
  retypedPassword: string;

  @ApiProperty()
  @Length(2)
  @Field()
  firstName: string;

  @ApiProperty()
  @Length(2)
  @Field()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @UserDoesNotExist()
  @Field()
  email: string;
}