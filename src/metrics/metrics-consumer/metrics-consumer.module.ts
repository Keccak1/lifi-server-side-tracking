import { Module } from '@nestjs/common';
import { GoogleAnalyticsProcessorModule } from '../metrics-processors/ga-metrics-processor/ga-metrics-processor.module';
import { MongoDbMetricsProcessorModule } from '../metrics-processors/mongo-db-metrics-processor/mongo-db-metrics-processor.module';
import { MetricsConsumerService } from './metrics-consumer.service';

@Module({
  imports: [GoogleAnalyticsProcessorModule, MongoDbMetricsProcessorModule],
  providers: [MetricsConsumerService],
  exports: [MetricsConsumerService],
})
export class MetricsConsumerModule {}
