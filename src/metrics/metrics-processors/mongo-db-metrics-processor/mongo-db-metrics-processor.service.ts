import { Injectable } from '@nestjs/common';
import { AdditionalData } from '../../../metrics/types';
import { IMetricsProcessor } from './../types';
import { MetricsRepositoryService } from './metrics.repository.service';

@Injectable()
export class MongoDbMetricsProcessorService implements IMetricsProcessor {
  constructor(
    private readonly metricsRepositoryService: MetricsRepositoryService,
  ) {}

  async process(
    clientId: string,
    sessionId: string,
    name: string,
    data: AdditionalData,
  ): Promise<boolean> {
    const value = await this.metricsRepositoryService.insertOne(
      clientId,
      sessionId,
      name,
      data,
    );

    return !!value;
  }
}
