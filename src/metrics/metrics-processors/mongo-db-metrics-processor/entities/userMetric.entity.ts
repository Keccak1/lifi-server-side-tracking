import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IUserMetric } from '../../../types';

@Schema({ autoCreate: true, autoIndex: true })
export class UserMetric implements IUserMetric {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  session: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data?: Record<string, any>;
}

export type MetricDocument = HydratedDocument<UserMetric>;
export const UserMetricSchema = SchemaFactory.createForClass(UserMetric);
