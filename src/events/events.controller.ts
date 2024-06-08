import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuardJwt } from './../auth/auth-guard.jwt';
import { CurrentUser } from './../auth/current-user.decorator';
import { User } from './../auth/user.entity';
import { EventsService } from './events.service';
import { CreateEventDto } from './inputs/create-event.dto';
import { ListEvents } from './inputs/list.events';
import { UpdateEventDto } from './inputs/update-event.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('events')
@Controller('events')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get events' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListEvents) {
    const events =
      await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        {
          total: true,
          currentPage: filter.page,
          limit: 2,
        },
      );
    return events;
  }

  // @Get('/practice')
  // async practice() {
  //   // return await this.repository.find({
  //   //   select: ['id', 'when'],
  //   //   where: [{
  //   //     id: MoreThan(3),
  //   //     when: MoreThan(new Date('2021-02-12T13:00:00'))
  //   //   }, {
  //   //     description: Like('%meet%')
  //   //   }],
  //   //   take: 2,
  //   //   order: {
  //   //     id: 'DESC'
  //   //   }
  //   // });
  // }

  // @Get('practice2')
  // async practice2() {
  //   // // return await this.repository.findOne(
  //   // //   1,
  //   // //   { relations: ['attendees'] }
  //   // // );
  //   // const event = await this.repository.findOne(
  //   //   1,
  //   //   { relations: ['attendees'] }
  //   // );
  //   // // const event = new Event();
  //   // // event.id = 1;

  //   // const attendee = new Attendee();
  //   // attendee.name = 'Using cascade';
  //   // // attendee.event = event;

  //   // event.attendees.push(attendee);
  //   // // event.attendees = [];

  //   // // await this.attendeeRepository.save(attendee);
  //   // await this.repository.save(event);

  //   // return event;

  //   // return await this.repository.createQueryBuilder('e')
  //   //   .select(['e.id', 'e.name'])
  //   //   .orderBy('e.id', 'ASC')
  //   //   .take(3)
  //   //   .getMany();
  // }

  @Get(':id')
  @ApiOperation({ summary: 'Get an event by id' })
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventsService.getEventWithAttendeeCount(id);

    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create an event' })
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return await this.eventsService.createEvent(input, user);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update an event' })
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventsService.findOne(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        `You are not authorized to change this event`,
      );
    }

    return await this.eventsService.updateEvent(event, input);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id, @CurrentUser() user: User) {
    const event = await this.eventsService.findOne(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        `You are not authorized to remove this event`,
      );
    }

    await this.eventsService.deleteEvent(id);
  }
}