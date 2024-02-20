export type AdditionalData = {
  [key: string]: string | number | boolean | AdditionalData | AdditionalData[];
};

export interface IMetric {
  name: string;
  data?: AdditionalData;
}

export interface IUserMetric extends IMetric {
  user: string;
}

export interface IMetricResult {
  success: boolean;
  statusCode: number;
}
