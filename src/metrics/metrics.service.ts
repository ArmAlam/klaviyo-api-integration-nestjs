import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';

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
      return {
        success: false,
        message: 'Failed to fetch metrics',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getEventCountByMetricAndDate(metricId: string, date: string) {
    const startDate = dayjs(date).startOf('day').toISOString();
    const endDate = dayjs(date).endOf('day').toISOString();

    const url = `${this.klaviyoBaseUrl}/api/metrics/${metricId}/timeline/`;

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
      console.error(
        'Error fetching event count:',
        error.response?.data || error.message,
      );
      return {
        success: false,
        message: 'Failed to fetch event count',
        error: error.response?.data || error.message,
      };
    }
  }

  async getEmailsByMetricAndDate(metricId: string, date: string) {
    const startDate = dayjs(date).startOf('day').toISOString();
    const endDate = dayjs(date).endOf('day').toISOString();

    const url = `${this.klaviyoBaseUrl}/api/metrics/${metricId}/timeline/`;

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

      // Extract emails from each event’s profile
      const emails = events
        .map((event) => event.attributes?.profile?.email)
        .filter((email) => !!email);

      return {
        success: true,
        metric_id: metricId,
        date,
        count: emails.length,
        emails,
      };
    } catch (error) {
      console.error(
        'Error fetching emails by metric and date:',
        error.response?.data || error.message,
      );
      return {
        success: false,
        message: 'Failed to fetch emails',
        error: error.response?.data || error.message,
      };
    }
  }
}
