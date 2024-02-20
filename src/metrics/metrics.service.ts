import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { MetricsConsumerService } from './metrics-consumer/metrics-consumer.service';
import { AdditionalData, IMetricResult } from './types';

@Injectable()
export class MetricsService {
  constructor(
    private readonly metricsConsumerService: MetricsConsumerService,
    private readonly loggerService: LoggerService,
  ) {
    this.loggerService.setContext(MetricsService.name);
  }

  async process(
    client: string,
    session: string,
    name: string,
    params?: AdditionalData,
  ): Promise<IMetricResult> {
    this.loggerService.debug(
      `Processing metrics: ${name}, ${JSON.stringify(params, null, ' ')}`,
    );

    const result = await this.metricsConsumerService.process(
      client,
      session,
      name,
      params,
    );

    if (!result) {
      this.loggerService.error('Failed to process metrics');
      throw new InternalServerErrorException();
    }

    return {
      success: result,
      statusCode: HttpStatus.ACCEPTED,
    };
  }
}
