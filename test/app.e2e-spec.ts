import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

let app: INestApplication;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = module.createNestApplication();
  await app.init();
});

afterAll(() => {
  app.close();
});

describe('Negative tests', () => {
  it('should return 404 fron non-exist route', async () => {
    const res = await request(app.getHttpServer())
      .get('/not/exist')
      .expect(404);

    expect(res.text).toBe(
      '{"statusCode":404,"message":"Cannot GET /not/exist","error":"Not Found"}',
    );
  });

  it('should return 400 from /login route', async () => {
    const badRequest = {};
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(badRequest)
      .expect(400);

    expect(res.text).toBe('{"statusCode":400,"message":"Bad request"}');
  });

  it('should return bad request', async () => {
    const badData = {login: '123'}
    const res = await request(app.getHttpServer())
      .post("/auth/register")
      .send(badData)
      .expect(400);
  })
});
