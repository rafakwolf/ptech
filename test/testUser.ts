import request from 'supertest';
import faker from 'faker';
import { Application } from 'express';

export async function createTestUser(app: Application) {
    const password = faker.internet.password();
    
    const user = await request(app)
        .post('/register')
        .send({
            email: faker.internet.email(),
            password,
            confirmation: password
        });

    return await request(app)
        .post('/login')
        .send({
            email: user.body.email,
            password,
        }).then(resp => resp.body);
}