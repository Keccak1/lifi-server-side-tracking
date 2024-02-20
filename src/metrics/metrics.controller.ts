import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ClientCookie, SessionCookie } from '../auth/auth.decorators';
import { AuthGuard } from '../auth/auth.guard';
import { MetricReqDto } from './dtos/metric.req.dto';
import { MetricResDto } from './dtos/metric.res.dto';
import { MetricsService } from './metrics.service';

@Controller({ version: '1', path: 'metrics' })
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async addMetric(
    @ClientCookie() client: string,
    @SessionCookie() session: string,
    @Body() { name, data }: MetricReqDto,
  ): Promise<MetricResDto> {
    return await this.metricsService.process(client, session, name, data);
  }
}
