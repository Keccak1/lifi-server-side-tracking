import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMetric, UserMetricSchema } from './entities/userMetric.entity';
import { MetricsRepositoryService } from './metrics.repository.service';
import { MongoDbMetricsProcessorService } from './mongo-db-metrics-processor.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserMetric.name, schema: UserMetricSchema },
    ]),
  ],
  providers: [MetricsRepositoryService, MongoDbMetricsProcessorService],
  exports: [MongoDbMetricsProcessorService],
})
export class MongoDbMetricsProcessorModule {}
