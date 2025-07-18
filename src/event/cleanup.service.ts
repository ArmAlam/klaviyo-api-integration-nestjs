import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { EventLog } from './entities/event-log.entity';

@Injectable()
export class CleanupService {
  constructor(
    @InjectRepository(EventLog)
    private readonly eventLogRepo: Repository<EventLog>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    console.log(' Running scheduled task to delete old event logs');
    await this.deleteOldLogs();
  }

  async deleteOldLogs(): Promise<void> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await this.eventLogRepo.delete({
      created_at: LessThan(sevenDaysAgo),
    });

    console.log(`Deleted ${result.affected} old event logs`);
  }
}
