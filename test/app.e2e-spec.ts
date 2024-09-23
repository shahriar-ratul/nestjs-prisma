import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /', () => {
        it('should return "Hello World!"', () => {
            return request(app.getHttpServer())
                .get('/')
                .expect(200)
                .expect('Hello World!');
        });
    });

    describe('GET /users', () => {
        it('should return an array of users', () => {
            return request(app.getHttpServer())
                .get('/users')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body.length).toBeGreaterThan(0);
                });
        });
    });

    describe('POST /users', () => {
        it('should create a new user', () => {
            const newUser = { name: 'John Doe', email: 'john@example.com' };
            return request(app.getHttpServer())
                .post('/users')
                .send(newUser)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body.name).toBe(newUser.name);
                    expect(res.body.email).toBe(newUser.email);
                });
        });
    });

    describe('GET /users/:id', () => {
        it('should return a specific user', () => {
            return request(app.getHttpServer())
                .get('/users/1')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id', 1);
                    expect(res.body).toHaveProperty('name');
                    expect(res.body).toHaveProperty('email');
                });
        });

        it('should return 404 for non-existent user', () => {
            return request(app.getHttpServer())
                .get('/users/999')
                .expect(404);
        });
    });
});
