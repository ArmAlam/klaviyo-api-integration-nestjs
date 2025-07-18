import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosRequestConfig } from 'axios';
import { handleKlaviyoError } from 'src/utils/klaviyoErrorHandler';
import { Repository } from 'typeorm';
import { BulkCreateEventDto, CreateEventDto } from './dto/create-event.dto';
import { EventLog } from './entities/event-log.entity';

@Injectable()
export class EventService {
  private readonly klaviyoBaseUrl: string;
  private readonly klaviyoApiKey: string;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(EventLog)
    private readonly eventLogRepo: Repository<EventLog>,
  ) {
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
          properties: dto.event_attributes,
          metric: {
            data: {
              type: 'metric',
              attributes: {
                name: dto.event_name,
              },
            },
          },
          profile: dto.profile_attributes,
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
        await this.eventLogRepo.save({
          raw_payload: JSON.stringify(paylaod),
        });

        return {
          success: true,
          message: 'Event created successfully',
          data: response.data,
        };
      }
    } catch (error) {
      handleKlaviyoError(error);
    }
  }

  async createbulkEvents(dto: BulkCreateEventDto) {
    const payload = {
      data: {
        type: 'event-bulk-create-job',
        attributes: {
          'events-bulk-create': {
            data: dto.events.map((event) => ({
              type: 'event-bulk-create',
              attributes: {
                profile: {
                  data: {
                    type: 'profile',
                    attributes: event.profile_attributes,
                    id:
                      event.profile_attributes.external_id ||
                      'auto_' + Date.now(),
                    meta: event.profile_attributes.meta,
                  },
                },
                events: {
                  data: [
                    {
                      type: 'event',
                      attributes: {
                        properties: event.event_attributes,
                        metric: {
                          data: {
                            type: 'metric',
                            attributes: {
                              name: event.event_name,
                              service: 'custom',
                            },
                          },
                        },
                        unique_id: 'evt_' + Date.now(),
                      },
                    },
                  ],
                },
              },
            })),
          },
        },
      },
    };

    try {
      const options: AxiosRequestConfig = {
        method: 'POST',
        url: `${this.klaviyoBaseUrl}/api/events/bulk-create-jobs/`,
        headers: {
          accept: 'application/vnd.api+json',
          revision: '2025-07-15',
          'content-type': 'application/vnd.api+json',
          Authorization: `Klaviyo-API-Key ${this.klaviyoApiKey}`,
        },
        data: payload,
      };

      const response = await axios.request(options);
      return {
        success: true,
        message: 'Bulk event creation submitted successfully',
        data: response.data,
      };
    } catch (error) {
      handleKlaviyoError(error);
    }
  }

  async getProfileByEmail(email: string) {
    const url = `${this.klaviyoBaseUrl}/api/profiles/`;

    try {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/vnd.api+json',
          revision: '2023-10-15',
          Authorization: `Klaviyo-API-Key ${this.klaviyoApiKey}`,
        },
        params: {
          filter: `equals(email,"${email}")`,
        },
      });

      const profiles = response.data?.data || [];

      if (profiles.length === 0) {
        return {
          success: false,
          message: 'No profile found for the provided email',
        };
      }

      return {
        success: true,
        profile: profiles[0],
      };
    } catch (error) {
      handleKlaviyoError(error);
    }
  }
}
