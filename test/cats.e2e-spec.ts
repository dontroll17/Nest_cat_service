import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { CatsModule } from '../src/cats/cats.module';
import { CatsEntity } from '../src/cats/entities/cats.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import 'dotenv/config';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';
import { AuthEntity } from '../src/auth/entities/auth.entitty';
import { JwtService } from '@nestjs/jwt';
import { JWT } from 'src/auth/interface/jwt.interface';
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager';

let app: INestApplication;
let repository: Repository<CatsEntity>;
let authRepository: Repository<AuthEntity>;
let authService: AuthService;
let token: JWT;
let cache;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      AuthModule,
      CatsModule,
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASS,
        database: process.env.DB_TEST_DATABASE,
        entities: [CatsEntity, AuthEntity],
        synchronize: false,
      }),
      TypeOrmModule.forFeature([AuthEntity]),
      CacheModule.register()
    ],
    providers: [AuthService, JwtService],
  }).compile();

  app = module.createNestApplication();
  repository = module.get(getRepositoryToken(CatsEntity));
  authRepository = module.get(getRepositoryToken(AuthEntity));
  authService = module.get(AuthService);
  cache = module.get(CACHE_MANAGER);
  await app.init();

  token = await authService.login({ login: 'test', password: '12345678', role: 'Admin' });
});

afterAll(async () => {
  await app.close();
});

afterEach(async () => {
  await repository.query('DELETE FROM cats_entity;');
});

describe('should GET /cats', () => {
  it('should return an array of cats', async () => {
    await repository.save([
      { nick: 'troll', role: 'lazy', vacant: true, coast: 500 },
      { nick: 'llort', role: 'top guy', vacant: true, coast: 500 },
    ]);

    const { body } = await request(app.getHttpServer())
      .get('/cats')
      .set('Accept', 'applization/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body).toEqual([
      {
        id: expect.any(String),
        nick: 'troll',
        role: 'lazy',
        vacant: true,
        coast: 500,
      },
      {
        id: expect.any(String),
        nick: 'llort',
        role: 'top guy',
        vacant: true,
        coast: 500,
      },
    ]);
  });
});

describe('should POST /cats', () => {
  it('should return a new created cat', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/cats')
      .send({
        nick: 'test',
        role: 'tester',
        vacant: true,
        coast: 500,
      })
      .set({ Authorization: 'Bearer ' + token.accessToken })
      .set('Accept', 'applization/json')
      .expect('Content-Type', /json/)
      .expect(201);

    expect(body).toEqual({
      id: expect.any(String),
      nick: 'test',
      role: 'tester',
      vacant: true,
      coast: 500,
    });
  });

  it('should not create new cat', async () => {
    const req = await request(app.getHttpServer())
      .post('/cats')
      .send({
        nick: 'test',
      })
      .set({ Authorization: 'Bearer ' + token.accessToken })
      .set('Accept', 'applization/json')
      .expect('Content-Type', /json/)
      .expect(400);

    expect(req.text).toBe('{"statusCode":400,"message":"Bad request"}');
  });
});

describe('should DELETE /cats/:id', () => {
  it('should remove cat', async () => {
    await repository.save([
      { nick: 'test', role: 'tester', vacant: true, coast: 500 },
      { nick: 'test2', role: 'main tester', vacant: true, coast: 500 },
    ]);

    const { body } = await request(app.getHttpServer())
      .get('/cats')
      .set('Accept', 'applization/json');

    const tester = body.find((i) => i.role === 'tester');
    expect(tester).toBeDefined();

    await request(app.getHttpServer())
      .delete(`/cats/${tester.id}`)
      .set({ Authorization: 'Bearer ' + token.accessToken })
      .expect(204);

    const allData = await repository.find();
    expect(allData).toHaveLength(1);
    expect(allData).toEqual([
      {
        id: expect.any(String),
        nick: 'test2',
        role: 'main tester',
        vacant: true,
        coast: 500,
      },
    ]);
  });
});

describe('should PUT /cats/:id', () => {
  it('should change cat', async () => {
    await repository.save({
      nick: 'test cat',
      role: 'test cat',
      vacant: true,
      coast: 500,
    });
    const cat = await repository.findOne({ where: { nick: 'test cat' } });

    await request(app.getHttpServer())
      .put(`/cats/${cat.id}`)
      .send({
        nick: 'test',
        role: 'tester',
        vacant: true,
        coast: 500,
      })
      .set({ Authorization: 'Bearer ' + token.accessToken })
      .set('Accept', 'applization/json')
      .expect('Content-Type', /json/)
      .expect(200);

    const base = await repository.find();

    expect(base).toHaveLength(1);
    expect(base[0]).toEqual({
      id: expect.any(String),
      nick: 'test',
      role: 'tester',
      vacant: true,
      coast: 500,
    });
  });
});
