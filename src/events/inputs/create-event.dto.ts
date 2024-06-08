import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @ApiProperty()
  @IsString()
  @Length(5, 255, { message: 'The name length is wrong' })
  name: string;

  @ApiProperty()
  @Length(5, 255)
  description: string;

  @ApiProperty()
  @IsDateString()
  when: string;

  @ApiProperty()
  @Length(5, 255)
  address: string;
}