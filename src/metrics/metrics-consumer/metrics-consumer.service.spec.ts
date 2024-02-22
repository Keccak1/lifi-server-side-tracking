import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../../logger/logger.service';
import { GoogleAnalyticsProcessorService } from '../metrics-processors/ga-metrics-processor/ga-metrics-processor.service';
import { MongoDbMetricsProcessorService } from '../metrics-processors/mongo-db-metrics-processor/mongo-db-metrics-processor.service';
import { MetricsConsumerService } from './metrics-consumer.service';

describe('MetricsConsumerService', () => {
  let service: MetricsConsumerService;
  let mockLoggerService: jest.Mocked<LoggerService>;
  let mockGoogleAnalyticsProcessorService: jest.Mocked<GoogleAnalyticsProcessorService>;
  let mockMongoDbMetricsProcessorService: jest.Mocked<MongoDbMetricsProcessorService>;

  beforeEach(async () => {
    mockLoggerService = {
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    mockGoogleAnalyticsProcessorService = {
      process: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<GoogleAnalyticsProcessorService>;

    mockMongoDbMetricsProcessorService = {
      process: jest.fn().mockResolvedValue(true),
    } as unknown as jest.Mocked<MongoDbMetricsProcessorService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsConsumerService,
        { provide: LoggerService, useValue: mockLoggerService },
        {
          provide: GoogleAnalyticsProcessorService,
          useValue: mockGoogleAnalyticsProcessorService,
        },
        {
          provide: MongoDbMetricsProcessorService,
          useValue: mockMongoDbMetricsProcessorService,
        },
      ],
    }).compile();

    service = module.get<MetricsConsumerService>(MetricsConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process metrics using all configured processors and return true if all succeed', async () => {
    const client = 'test-client';
    const session = 'test-session';
    const name = 'test-metric';
    const params = { key: 'value' };

    const result = await service.process(client, session, name, params);

    expect(mockGoogleAnalyticsProcessorService.process).toHaveBeenCalledWith(
      client,
      session,
      name,
      params,
    );
    expect(mockMongoDbMetricsProcessorService.process).toHaveBeenCalledWith(
      client,
      session,
      name,
      params,
    );
    expect(result).toBe(true);
  });

  it('should return false if any processor fails', async () => {
    mockGoogleAnalyticsProcessorService.process.mockResolvedValueOnce(false);

    const client = 'test-client';
    const session = 'test-session';
    const name = 'another-test-metric';
    const params = { anotherKey: 'anotherValue' };

    const result = await service.process(client, session, name, params);

    expect(result).toBe(false);
  });
});
