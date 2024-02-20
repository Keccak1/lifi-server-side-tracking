import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { LoggerService } from '../../../logger/logger.service';
import { AdditionalData } from '../../../metrics/types';
import { IMetricsProcessor } from './../types';

@Injectable()
export class GoogleAnalyticsProcessorService implements IMetricsProcessor {
  private GA_MEASUREMENT_ID: string;
  private GA_API_SECRET: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    this.GA_MEASUREMENT_ID =
      this.configService.get<string>('GA_MEASUREMENT_ID');
    this.GA_API_SECRET = this.configService.get<string>('GA_API_SECRET');
  }

  async process(
    clientId: string,
    sessionId: string,
    name: string,
    data: AdditionalData,
  ): Promise<boolean> {
    const payload = {
      client_id: clientId,
      events: [
        {
          name: name,
          params: {
            session_id: sessionId,
            // this is a 'hack' to emphasis a user session
            // TODO: discuss with the team more appropriate way to handle this
            engagement_time_msec: '1',
            ...data,
          },
        },
      ],
    };

    this.loggerService.debug(
      `data to GA: name: ${name}, data: ${JSON.stringify(data, null, ' ')}`,
    );

    try {
      // for some reason api does not return any valuable data...
      // TODO: any ideas how to handle this?
      const { data, status } = await axios.post(
        `https://www.google-analytics.com/mp/collect?measurement_id=${this.GA_MEASUREMENT_ID}&api_secret=${this.GA_API_SECRET}`,
        payload,
      );

      this.loggerService.debug(
        `GA response: ${status} ${JSON.stringify(data, null, ' ')}`,
      );

      return status === HttpStatus.NO_CONTENT;
    } catch (error: unknown) {
      return false;
    }
  }
}
