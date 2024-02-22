import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { GoogleAnalyticsProcessorService } from '../metrics-processors/ga-metrics-processor/ga-metrics-processor.service';
import { MongoDbMetricsProcessorService } from '../metrics-processors/mongo-db-metrics-processor/mongo-db-metrics-processor.service';
import { IMetricsProcessor } from '../metrics-processors/types';
import { AdditionalData } from '../types';

@Injectable()
export class MetricsConsumerService {
  private readonly processors: Map<string, IMetricsProcessor> = new Map();
  constructor(
    private readonly loggerService: LoggerService,
    private readonly mongoDbMetricsProcessorService: MongoDbMetricsProcessorService,
    private readonly googleAnalyticsProcessorService: GoogleAnalyticsProcessorService,
  ) {
    this.processors.set('mongo-db', this.mongoDbMetricsProcessorService);
    this.processors.set(
      'google-analytics',
      this.googleAnalyticsProcessorService,
    );
  }

  async process(
    client: string,
    session: string,
    name: string,
    params?: AdditionalData,
  ): Promise<boolean> {
    const results = await Promise.all(
      Array.from(this.processors.keys()).map(async (processorName) => {
        const processor = this.processors.get(processorName);
        this.loggerService.debug(
          `Processing metrics: ${name} with ${processorName}`,
        );
        const success = await processor.process(client, session, name, params);
        if (!success) {
          this.loggerService.warn(
            `Failure metrics processing: ${name} with ${processorName} - ${success}`,
          );
        }
        return success;
      }),
    );

    return results.reduce((acc, curr) => acc && curr, true);
  }
}
