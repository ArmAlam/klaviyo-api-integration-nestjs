import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';

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
}
