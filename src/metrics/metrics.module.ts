import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MetricsConsumerModule } from './metrics-consumer/metrics-consumer.module';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
  imports: [AuthModule, MetricsConsumerModule],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MetricsModule {}
