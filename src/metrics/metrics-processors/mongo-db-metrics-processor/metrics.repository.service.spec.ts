import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../../../logger/logger.service';
import { UserMetric } from './entities/userMetric.entity';
import { MetricsRepositoryService } from './metrics.repository.service';

describe('MetricsRepositoryService', () => {
  let service: MetricsRepositoryService;
  let mockMetricModel: any;

  beforeEach(async () => {
    const mockMetricSave = jest.fn().mockResolvedValue(true);

    mockMetricModel = function () {
      return { save: mockMetricSave };
    };

    mockMetricModel.create = jest.fn().mockImplementation((dto) => {
      return { ...dto, save: mockMetricSave };
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsRepositoryService,
        { provide: getModelToken(UserMetric.name), useValue: mockMetricModel },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MetricsRepositoryService>(MetricsRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save a metric', async () => {
    const user = 'test-user';
    const session = 'test-session';
    const name = 'test-metric';
    const data = { key: 'value' };

    await service.insertOne(user, session, name, data);

    expect(mockMetricModel().save).toHaveBeenCalled();
  });

  it('should create a metric', async () => {
    const user = 'test-user';
    const session = 'test-session';
    const name = 'test-metric';
    const data = { key: 'value' };

    expect(await service.insertOne(user, session, name, data)).toEqual(true);
  });
});
