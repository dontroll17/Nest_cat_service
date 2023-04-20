import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { CatsModule } from "../src/cats/cats.module";
import { CatsEntity } from "../src/cats/entities/cats.entity";
import * as request from "supertest";
import { Repository } from "typeorm";
import 'dotenv/config';

let app: INestApplication;
let repository: Repository<CatsEntity>;

beforeAll(async () => {
    const module = await Test.createTestingModule({
        imports: [
            CatsModule,
            TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASS,
                database: process.env.DB_TEST_DATABASE,
                entities: [CatsEntity],
                synchronize: true
              })
        ]
    }).compile();

    app = module.createNestApplication();
    repository = module.get(getRepositoryToken(CatsEntity));
    await app.init();
});

afterAll(async () => {
    await app.close();
});

afterEach(async () => {
    await repository.query('DELETE FROM cats_entity');
});

describe('should GET /cats', () => {
    it('should return an array of cats', async () => {
        await repository.save([
            {nick: 'troll', role: 'lazy'},
            {nick: 'llort', role: 'top guy'}
        ]);

        const { body } = await request(app.getHttpServer())
            .get('/cats')
            .set('Accept', 'applization/json')
            .expect('Content-Type', /json/)
            .expect(200)

        expect(body).toEqual([
            {id: expect.any(String), nick: 'troll', role: 'lazy'},
            {id: expect.any(String), nick: 'llort', role: 'top guy'}
        ]);
    });
});

describe('should POST /cats', () => {
    it('should return a new created cat', async () => {
        const { body } = await request(app.getHttpServer())
            .post('/cats')
            .send({
                nick: 'test',
                role: 'tester'
            })
            .set('Accept', 'applization/json')
            .expect('Content-Type', /json/)
            .expect(201);

        expect(body).toEqual({
            id: expect.any(String), nick: 'test', role: 'tester'
        });
    });

    it('should not create new cat', async () => {
        await request(app.getHttpServer())
            .post('/cats')
            .send({
                nick: 'test',
            })
            .set('Accept', 'applization/json')
            .expect('Content-Type', /json/)
            .expect(500);
    });
});