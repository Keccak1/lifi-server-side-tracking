import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  it('/auth/log-in (POST) - success', () => {
    return request(app.getHttpServer())
      .post('/auth/log-in')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            message: 'User logged in',
            statusCode: 200,
          }),
        );
        expect(res.headers['set-cookie']).toBeDefined();
      });
  });

  it('/auth/logout (POST) - not logged in', () => {
    return request(app.getHttpServer()).post('/auth/log-out').expect({
      statusCode: 400,
      error: 'Bad Request',
      message: 'User not logged in',
    });
  });

  it('/auth/is-logged-in (GET) - not logged in', () => {
    return request(app.getHttpServer()).get('/auth/is-logged-in').expect({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'User is not logged in',
    });
  });

  it('/auth/log-out (POST) - logged in', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/log-in')
      .expect(200);

    const cookie = response.headers['set-cookie'];

    return request(app.getHttpServer())
      .post('/auth/log-out')
      .set('Cookie', cookie)
      .expect(200);
  });

  it('/auth/is-logged-in (GET) - logged in', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/log-in')
      .expect(200);

    const cookie = response.headers['set-cookie'];

    return request(app.getHttpServer())
      .get('/auth/is-logged-in')
      .set('Cookie', cookie)
      .expect(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
