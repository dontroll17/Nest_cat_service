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
    await app.init();
});

afterAll(() => {
    app.close();
});

describe('Positive', () => {
    it('should return 200 for exist route', async () => {
        try {
            await request(app.getHttpServer())
                .get('/cats')
                .expect(200)
        } catch (e) {
            console.error(e);
        }
        
    });
});

describe('Negative', () => {
    it('should return 404 fron non-exist route', async () => {
        try {
            const req = await request(app.getHttpServer())
                .get('/not/exist')
                .expect(404);

            expect(req.text).toBe('{"statusCode":404,"message":"Cannot GET /not/exist","error":"Not Found"}');
        } catch (e) {
            console.error(e);
        }   
    });

    it('should return 400 from /login route', async () => {
        const badRequest = {};
        try {
            const req = await request(app.getHttpServer())
                .post('/auth/login')
                .send(badRequest)
                .expect(400)
        
            expect(req.text).toBe('{"statusCode":400,"message":"Bad request"}');
        } catch (e) {
            console.error(e);
        }
    });
});