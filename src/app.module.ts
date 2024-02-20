import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const dbName = config.get<string>('MONGO_DB');
        return {
          uri: config.get<string>('MONGO_URI'),
          dbName: dbName ? dbName : undefined,
        };
      },
    }),
    LoggerModule,
    AuthModule,
    MetricsModule,
  ],
})
export class AppModule {}
