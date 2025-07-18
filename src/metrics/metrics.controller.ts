import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available metrics from Klaviyo' })
  getAllMetrics() {
    return this.metricsService.getAllMetrics();
  }

  @Get('count')
  @ApiOperation({ summary: 'Get event count by metric ID for a specific date' })
  @ApiQuery({ name: 'metric_id', required: true, type: String })
  @ApiQuery({
    name: 'date',
    required: true,
    type: String,
    description: 'Format: YYYY-MM-DD',
  })
  getEventCount(
    @Query('metric_id') metricId: string,
    @Query('date') date: string,
  ) {
    return this.metricsService.getEventCountByMetricAndDate(metricId, date);
  }

  @Get('emails')
  @ApiOperation({
    summary: 'Get list of emails by metric ID for a specific date',
  })
  @ApiQuery({ name: 'metric_id', required: true, type: String })
  @ApiQuery({
    name: 'date',
    required: true,
    type: String,
    description: 'Format: YYYY-MM-DD',
  })
  getEmailsByMetricAndDate(
    @Query('metric_id') metricId: string,
    @Query('date') date: string,
  ) {
    return this.metricsService.getEmailsByMetricAndDate(metricId, date);
  }
}
