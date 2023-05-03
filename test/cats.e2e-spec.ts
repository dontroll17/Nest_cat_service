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
import { Role } from '../src/auth/dto/create-user.dto';
import { FilesEntity } from '../src/files/entities/files.entity';

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
        entities: [CatsEntity, AuthEntity, FilesEntity],
        synchronize: true,
      }),
      TypeOrmModule.forFeature([AuthEntity]),
      CacheModule.register(),
    ],
    providers: [AuthService, JwtService],
  }).compile();

  app = module.createNestApplication();
  repository = module.get(getRepositoryToken(CatsEntity));
  authRepository = module.get(getRepositoryToken(AuthEntity));
  authService = module.get(AuthService);
  cache = module.get(CACHE_MANAGER);
  await app.init();

  token = await authService.register({
    login: 'test',
    password: '12345678',
    role: Role.Admin,
  });
});

afterAll(async () => {
  await repository.query('DELETE FROM auth;');
  await app.close();
});

afterEach(async () => {
  await repository.query('DELETE FROM cats;');
});

describe('should GET /cats', () => {
  it('should return an array of cats', async () => {
    await repository.save([
      { nick: 'troll', role: 'lazy', coast: 500 },
      { nick: 'llort', role: 'top guy', coast: 500 },
    ]);

    const res = await request(app.getHttpServer())
      .get('/cats')
      .set('Accept', 'applization/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toEqual([
      {
        id: expect.any(String),
        nick: 'troll',
        role: 'lazy',
        coast: 500,
      },
      {
        id: expect.any(String),
        nick: 'llort',
        role: 'top guy',
        coast: 500,
      },
    ]);

    expect(res.headers['x-powered-by']).toContain('Express');
  });
});

describe('route POST /cats', () => {
  it('should return a new created cat', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/cats')
      .send({
        nick: 'test',
        role: 'tester',
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

    expect(req.text).toBe('{"statusCode":400,"message":"Bad request",\"error\":\"Bad Request\"}');
  });

  it('should return exeption POST /cats', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/cats')
      .send({
        nick: 'test',
        role: 'tester',

        coast: 500,
      })
      .set({ Authorization: 'Bearer ' + token.accessToken })
      .set('Accept', 'applization/json')
      .expect('Content-Type', /json/)
      .expect(201);

    await request(app.getHttpServer())
      .post('/cats')
      .send({
        nick: 'test',
        role: 'tester',
        coast: 500,
      })
      .set({ Authorization: 'Bearer ' + token.accessToken })
      .set('Accept', 'applization/json')
      .expect('Content-Type', /json/)
      .expect(400);
  });
});

describe('should DELETE /cats/:id', () => {
  it('should remove cat', async () => {
    await repository.save([
      { nick: 'test', role: 'tester', coast: 500 },
      { nick: 'test2', role: 'main tester', coast: 500 },
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

        coast: 500,
      },
    ]);
  });
});

describe('should PUT /cats/:id', () => {
  it('should change cat', async () => {
    const testData = {
      nick: 'test cat',
      role: 'test cat',

      coast: 500,
    };
    await repository.save(testData);
    const cat = await repository.findOne({ where: { nick: 'test cat' } });

    await request(app.getHttpServer())
      .put(`/cats/${cat.id}`)
      .send({
        nick: 'test',
        role: 'tester',

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
      coast: 500,
    });
  });
});
