import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CleanupService } from './cleanup.service';
import { EventLog } from './entities/event-log.entity';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventLog])],
  controllers: [EventController],
  providers: [EventService, CleanupService],
})
export class EventModule {}
