import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('MetricsModule (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  it('/metrics (POST) - should add metric and return result', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/log-in')
      .expect(200);

    const cookie = response.headers['set-cookie'];

    const metricData = { name: 'testMetric', data: { value: 100 } };

    return request(app.getHttpServer())
      .post('/metrics')
      .set('Cookie', cookie)
      .send(metricData)
      .expect(HttpStatus.CREATED);
  });

  it("/metrics (POST) - should return 'User not logged in' when not logged in", () => {
    return request(app.getHttpServer()).post('/metrics').expect({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Forbidden resource',
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
