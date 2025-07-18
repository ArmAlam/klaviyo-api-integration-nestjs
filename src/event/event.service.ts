import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
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

  async createEvent(dto: CreateEventDto) {
    const paylaod = {
      data: {
        type: 'event',
        attributes: {
          properties: dto.event_attributes || {},
          metric: {
            data: {
              type: 'metric',
              attributes: {
                name: dto.event_name,
              },
            },
          },
          profile: {
            data: {
              type: 'profile',
              attributes: {
                ...dto.profile_attributes,
                meta: dto.profile_attributes?.meta,
                properties: dto.profile_attributes?.properties,
                location: dto.profile_attributes?.location,
              },
              id: dto.profile_attributes?.external_id || 'auto_' + Date.now(),
            },
          },
          unique_id: 'evt_' + Date.now(),
        },
      },
    };

    try {
      const options: AxiosRequestConfig = {
        method: 'POST',
        url: `${this.klaviyoBaseUrl}/api/events`,
        headers: {
          accept: 'application/vnd.api+json',
          revision: '2025-07-15',
          'content-type': 'application/vnd.api+json',
          Authorization: `Klaviyo-API-Key ${this.klaviyoApiKey}`,
        },
        data: JSON.stringify(paylaod),
      };

      const response = await axios.request(options);

      if (response) {
        return {
          success: true,
          message: 'Event created successfully',
          data: response.data,
        };
      }
    } catch (error) {
      console.error('Error creating event:', error);
      return {
        success: false,
        message: 'Failed to create event',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
