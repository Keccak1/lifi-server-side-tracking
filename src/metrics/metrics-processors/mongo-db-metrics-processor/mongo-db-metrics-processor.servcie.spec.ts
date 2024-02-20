import { Test, TestingModule } from '@nestjs/testing';
import { MetricsRepositoryService } from './metrics.repository.service';
import { MongoDbMetricsProcessorService } from './mongo-db-metrics-processor.service';

describe('MongoDbMetricsProcessorService', () => {
  let service: MongoDbMetricsProcessorService;
  let metricsRepositoryService: jest.Mocked<MetricsRepositoryService>;

  beforeEach(async () => {
    metricsRepositoryService = {
      createMetric: jest.fn(),
    } as unknown as jest.Mocked<MetricsRepositoryService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoDbMetricsProcessorService,
        {
          provide: MetricsRepositoryService,
          useValue: metricsRepositoryService,
        },
      ],
    }).compile();

    service = module.get<MongoDbMetricsProcessorService>(
      MongoDbMetricsProcessorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(metricsRepositoryService).toBeDefined();
  });

  describe('process', () => {
    it('should return true when metric is successfully created', async () => {
      metricsRepositoryService.createMetric = jest.fn().mockResolvedValue(true);
      const result = await service.process(
        'client-id',
        'session-id',
        'event-name',
        {},
      );

      expect(metricsRepositoryService.createMetric).toHaveBeenCalledWith(
        'client-id',
        'session-id',
        'event-name',
        {},
      );
      expect(result).toBe(true);
    });

    it('should return false when metric creation fails', async () => {
      metricsRepositoryService.createMetric = jest.fn().mockResolvedValue(null);

      const result = await service.process(
        'client-id',
        'session-id',
        'event-name',
        {},
      );

      expect(metricsRepositoryService.createMetric).toHaveBeenCalledWith(
        'client-id',
        'session-id',
        'event-name',
        {},
      );
      expect(result).toBe(false);
    });
  });
});
