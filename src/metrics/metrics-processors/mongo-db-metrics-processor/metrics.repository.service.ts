import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoggerService } from '../../../logger/logger.service';
import { MetricDocument, UserMetric } from './entities/userMetric.entity';

@Injectable()
export class MetricsRepositoryService {
  constructor(
    @InjectModel(UserMetric.name)
    private readonly metricModel: Model<MetricDocument>,
    private readonly loggerService: LoggerService,
  ) {}

  async insertOne(
    user: string,
    session: string,
    name: string,
    data: Record<string, any>,
  ): Promise<MetricDocument | null> {
    try {
      const metric = new this.metricModel({ user, session, name, data });
      this.loggerService.log(`Creating metric: ${metric}`);
      return metric.save();
    } catch (error: unknown) {}

    return null;
  }
}
