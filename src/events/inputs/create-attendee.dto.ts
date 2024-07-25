import { IsEnum } from 'class-validator';
import { AttendeeAnswerEnum } from './../attendee.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendeeDto {
  @ApiProperty()
  @IsEnum(AttendeeAnswerEnum)
  answer: AttendeeAnswerEnum;
}
