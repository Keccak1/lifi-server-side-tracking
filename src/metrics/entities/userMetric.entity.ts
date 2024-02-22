import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { IUserMetric } from '../types';

@Schema({ autoCreate: true, autoIndex: true, timestamps: true })
export class UserMetric implements IUserMetric {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  name: string;

  @Prop(
    raw({
      key: { type: String },
      value: { type: SchemaTypes.Mixed },
    }),
  )
  data?: Record<string, any>;
}

export type MetricDocument = HydratedDocument<UserMetric>;
export const UserMetricSchema = SchemaFactory.createForClass(UserMetric);
