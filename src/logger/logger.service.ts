import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly logLevels: LogLevel[] = [
    'verbose',
    'debug',
    'log',
    'warn',
    'error',
    'fatal',
  ];

  constructor(private readonly configService: ConfigService) {
    super();
    const levelFromConfig = this.configService.get<LogLevel>('LOG_LEVEL');
    const level = this.logLevels.includes(levelFromConfig)
      ? levelFromConfig
      : 'verbose';
    const index = this.logLevels.indexOf(level);
    this.logLevels = this.logLevels.slice(index);
    this.setLogLevels(this.logLevels);
  }
}
