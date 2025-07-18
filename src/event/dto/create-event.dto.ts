import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    example: 'User Signed Up',
    description: 'The name of the event (metric)',
  })
  event_name: string;

  @ApiProperty({
    type: Object,
    example: {
      category: 'signup',
      utm_source: 'newsletter',
    },
    description: 'Custom key-value attributes related to the event',
  })
  event_attributes: Record<string, any>;

  @ApiProperty({
    type: Object,
    description: 'Klaviyo user profile attributes',
    example: {
      email: 'jane.doe@example.com',
      phone_number: '+8801824567890',
      external_id: 'user_12345',
      anonymous_id: 'anon_abc123',
      first_name: 'Jane',
      last_name: 'Doe',
      organization: 'Acme Corp',
      locale: 'en-US',
      title: 'Marketing Manager',
      image: 'https://example.com/images/jane.jpg',
      location: {
        address1: '123 Main St',
        address2: 'Apt 4B',
        city: 'New York',
        country: 'US',
        latitude: '40.7128',
        longitude: '-74.0060',
        region: 'NY',
        zip: '10001',
        timezone: 'America/New_York',
        ip: '203.0.113.42',
      },
      properties: {
        referral: 'friend',
        preferred_language: 'en',
      },
      meta: {
        patch_properties: {
          append: {
            tags: ['new', 'beta-tester'],
          },
          unappend: {
            tags: ['old-user'],
          },
          unset: 'legacy_field',
        },
      },
    },
  })
  profile_attributes: Record<string, any>;
}
