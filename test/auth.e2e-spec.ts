import { INestApplication } from '@nestjs/common';
import { AuthEntity } from '../src/auth/entities/auth.entitty';
import { Repository } from 'typeorm';
import { AuthModule } from '../src/auth/auth.module';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import 'dotenv/config';
import * as request from 'supertest';

let app: INestApplication;
let authRepo: Repository<AuthEntity>;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      AuthModule,
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASS,
        database: process.env.DB_TEST_DATABASE,
        entities: [AuthEntity],
        synchronize: false,
      }),
    ],
  }).compile();

  app = module.createNestApplication();
  authRepo = module.get(getRepositoryToken(AuthEntity));
  await app.init();
});

afterAll(async () => {
  await app.close();
});

afterEach(async () => {
  await authRepo.query(`DELETE FROM auth;`);
});

describe('should POST /cats', () => {
  it('should return a new created user', async () => {
    const sendData = {
      login: 'tester',
      password: '12345678',
      role: 'Admin',
    };
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(sendData)
      .set('Accept', 'applization/json')
      .expect('Content-Type', /json/)
      .expect(201);
  });

  it('should return token', async () => {
    const sendData = {
      login: 'tester',
      password: '12345678',
      role: 'Admin',
    };
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(sendData)
      .set('Accept', 'applization/json');
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(sendData)
      .set('Accept', 'applization/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body).toEqual({ accessToken: expect.any(String) });
  });
});
