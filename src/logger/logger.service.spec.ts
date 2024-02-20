import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  it('should set log level to verbose by default', () => {
    jest.spyOn(configService, 'get').mockImplementation(() => undefined);
    const logger = new LoggerService(configService);
    expect(logger['logLevels']).toContain('verbose');
  });

  it('should set log level based on config', () => {
    const expectedLevel = 'warn';
    jest.spyOn(configService, 'get').mockImplementation(() => expectedLevel);
    const logger = new LoggerService(configService);
    expect(logger['logLevels']).toContain(expectedLevel);
  });
});
