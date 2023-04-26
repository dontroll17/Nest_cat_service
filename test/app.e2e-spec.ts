import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import * as request from 'supertest';

let app: INestApplication;

beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AppModule
      ]
    }).compile();

    app = module.createNestApplication();
});

afterAll(() => {
    app.close();
});

describe('Negative', () => {
    it('should return 404 fron non-exist route', async () => {
        await request(app.getHttpServer())
            .get('/not/exist')
            .expect(404);
    });
});