import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BulkCreateEventDto, CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: 'Create a single event and send to Klaviyo' })
  create(@Body() dto: CreateEventDto) {
    return this.eventService.createEvent(dto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple events and send to Klaviyo' })
  bulkCreate(@Body() dto: BulkCreateEventDto) {
    return this.eventService.createbulkEvents(dto);
  }
}
