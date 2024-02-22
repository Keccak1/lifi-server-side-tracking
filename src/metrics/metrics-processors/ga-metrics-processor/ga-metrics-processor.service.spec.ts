import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { LoggerService } from '../../../logger/logger.service';
import { GoogleAnalyticsProcessorService } from './ga-metrics-processor.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GoogleAnalyticsProcessorService', () => {
  let service: GoogleAnalyticsProcessorService;
  let configService: ConfigService;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleAnalyticsProcessorService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'GA_MEASUREMENT_ID') return 'test-measurement-id';
              if (key === 'GA_API_SECRET') return 'test-api-secret';
            }),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GoogleAnalyticsProcessorService>(
      GoogleAnalyticsProcessorService,
    );
    configService = module.get<ConfigService>(ConfigService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(configService).toBeDefined();
    expect(loggerService).toBeDefined();
  });

  it('processes data and returns true on successful API call', async () => {
    mockedAxios.post.mockResolvedValue({ status: HttpStatus.NO_CONTENT });
    const result = await service.process(
      'client-id',
      'session-id',
      'event-name',
      {},
    );
    expect(result).toBe(true);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
    );
    expect(loggerService.debug).toHaveBeenCalled();
  });

  it('returns false on API call failure', async () => {
    mockedAxios.post.mockRejectedValue(new Error('API call failed'));
    const result = await service.process(
      'client-id',
      'session-id',
      'event-name',
      {},
    );
    expect(result).toBe(false);
    expect(loggerService.debug).toHaveBeenCalled();
  });
});
