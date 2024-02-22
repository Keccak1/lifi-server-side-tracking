import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/auth.guard';
import { LoggerService } from '../logger/logger.service';
import { MetricsConsumerService } from './metrics-consumer/metrics-consumer.service';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

describe('MetricsController', () => {
  let controller: MetricsController;
  let mockMetricsConsumerService: jest.Mocked<MetricsConsumerService>;
  let mockMetricsService: jest.Mocked<MetricsService>;

  beforeEach(async () => {
    mockMetricsConsumerService = {
      process: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<MetricsConsumerService>;

    mockMetricsService = {
      process: jest.fn(),
    } as unknown as jest.Mocked<MetricsService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: MetricsConsumerService,
          useValue: mockMetricsConsumerService,
        },
        {
          provide: MetricsService,
          useValue: mockMetricsService,
        },
        {
          provide: LoggerService,
          useValue: {
            setContext: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MetricsController>(MetricsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call mockMetricsService.process with the correct parameters', async () => {
    const client = 'test-client';
    const session = 'test-session';
    const metricReqDto = { name: 'test-metric', data: { key: 'value' } };

    await controller.addMetric(client, session, metricReqDto);

    expect(mockMetricsService.process).toHaveBeenCalledWith(
      client,
      session,
      metricReqDto.name,
      metricReqDto.data,
    );
  });
});
