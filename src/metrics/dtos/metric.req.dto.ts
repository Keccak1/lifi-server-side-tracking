import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AdditionalData, IMetric } from '../types';

export class MetricReqDto implements IMetric {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  data?: AdditionalData;
}
