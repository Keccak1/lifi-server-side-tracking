import { Module } from '@nestjs/common';
import { GoogleAnalyticsProcessorService } from './ga-metrics-processor.service';

@Module({
  providers: [GoogleAnalyticsProcessorService],
  exports: [GoogleAnalyticsProcessorService],
})
export class GoogleAnalyticsProcessorModule {}
