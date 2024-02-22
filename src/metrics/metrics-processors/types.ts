import { AdditionalData } from '../types';

export interface IMetricsProcessor {
  process(
    clientId: string,
    name: string,
    sessionId: string,
    data: AdditionalData,
  ): Promise<boolean>;
}
