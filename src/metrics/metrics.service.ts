import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import { handleKlaviyoError } from 'src/utils/klaviyoErrorHandler';

@Injectable()
export class MetricsService {
  private readonly klaviyoBaseUrl: string;
  private readonly klaviyoApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.klaviyoApiKey = this.configService.get<string>(
      'KLAVIYO_PRIVATE_API_KEY',
    )!;

    this.klaviyoBaseUrl = this.configService.get<string>(
      'KLAVIYO_API_BASE_URL',
    )!;
  }

  async getAllMetrics() {
    try {
      const options: AxiosRequestConfig = {
        method: 'GET',
        url: `${this.klaviyoBaseUrl}/api/events`,
        headers: {
          accept: 'application/vnd.api+json',
          revision: '2025-07-15',
          'content-type': 'application/vnd.api+json',
          Authorization: `Klaviyo-API-Key ${this.klaviyoApiKey}`,
        },
      };

      const response = await axios.request(options);

      if (response) {
        return {
          success: true,
          message: 'Metrics ',
          data: response.data,
        };
      }
    } catch (error) {
      handleKlaviyoError(error);
    }
  }

  async getEventCountByMetricAndDate(metricId: string, date: string) {
    const startDate = dayjs(date).startOf('day').toISOString();
    const endDate = dayjs(date).endOf('day').toISOString();

    const url = `${this.klaviyoBaseUrl}/api/events/filter=equals(metric_id,"${metricId}")&filter=greater-or-equal(created,"${startDate}")&filter=less-than(created,"${endDate}")`;

    try {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/vnd.api+json',
          revision: '2023-10-15',
          Authorization: `Klaviyo-API-Key ${this.klaviyoApiKey}`,
        },
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });

      const events = response.data?.data || [];
      return {
        success: true,
        date,
        metric_id: metricId,
        count: events.length,
      };
    } catch (error) {
      handleKlaviyoError(error);
    }
  }
}
