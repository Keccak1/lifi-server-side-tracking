import { IsBoolean, IsNumber } from 'class-validator';
import { IMetricResult } from '../types';

export class MetricResDto implements IMetricResult {
  @IsBoolean()
  readonly success: boolean;

  @IsNumber()
  readonly statusCode: number;
}
