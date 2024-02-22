import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../logger/logger.service';
import { MetricsConsumerService } from './metrics-consumer/metrics-consumer.service';
import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;
  let mockMetricsConsumerService: jest.Mocked<MetricsConsumerService>;
  let mockLoggerService: jest.Mocked<LoggerService>;

  beforeEach(async () => {
    mockMetricsConsumerService = {
      process: jest.fn(),
    } as unknown as jest.Mocked<MetricsConsumerService>;

    mockLoggerService = {
      setContext: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        {
          provide: MetricsConsumerService,
          useValue: mockMetricsConsumerService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  it('should log an error and throw InternalServerErrorException when processing fails', async () => {
    const client = 'test-client';
    const session = 'test-session';
    const name = 'test-metric-fail';
    const params = { key: 'value' };

    mockMetricsConsumerService.process.mockResolvedValue(false);

    await expect(
      service.process(client, session, name, params),
    ).rejects.toThrow(InternalServerErrorException);

    expect(mockLoggerService.error).toHaveBeenCalled();
  });

  it('should log and process metrics successfully', async () => {
    const client = 'test-client';
    const session = 'test-session';
    const name = 'test-metric';
    const params = { key: 'value' };

    mockMetricsConsumerService.process.mockResolvedValue(true);

    const result = await service.process(client, session, name, params);

    expect(mockMetricsConsumerService.process).toHaveBeenCalledWith(
      client,
      session,
      name,
      params,
    );
    expect(mockLoggerService.debug).toHaveBeenCalled();
    expect(result).toEqual({ success: true, statusCode: HttpStatus.ACCEPTED });
  });
});
