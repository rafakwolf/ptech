import app from '../app';
import request from 'supertest';
import faker from 'faker';
import { testDbConnection } from './dbConntection';
import chai from 'chai';
import { User } from '../src/models/User';
import sinon from 'sinon';
import { Connection } from 'typeorm';

const assert = chai.assert;

describe('UserController', async () => {
    let conn: Connection;

    before(async () => {
        conn = await testDbConnection();
        User.delete({});
    });

    after(() => {
        conn?.close();
    });

    it('should register a user', async () => {
        const testUser = {
            email: faker.internet.email(),
            password: '123456',
            confirmation: '123456'
        };        
        const result = await request(app)
            .post('/register')
            .type('json')
            .send(testUser);

        assert.strictEqual(result.status, 200);
        assert.isDefined(result.body.id);
    });

    it('should validate user fields', async () => {
        const expectedError = [
            'Email must be informed.',
            'Password must be informed.',
            'Confirmation must be informed.'
        ];        
        const result = await request(app)
            .post('/register')
            .type('json')
            .send({});

        assert.strictEqual(result.status, 400);
        assert.deepStrictEqual(result.body, expectedError);
    });

    it('should validate password and confirmation', async () => {
        const testUser = {
            email: faker.internet.email(),
            password: '123456',
            confirmation: '1234567'
        };        
        const result = await request(app)
            .post('/register')
            .type('json')
            .send(testUser);

        assert.strictEqual(result.status, 400);
        assert.deepStrictEqual(result.body, {message: 'Password and Confirmation must be the same.'});
    });

    it('Should validate duplicated email', async () => {
        const email = faker.internet.email();
        const testUser = {
            email,
            password: '123456',
            confirmation: '123456'
        };
        await request(app)
            .post('/register')
            .type('json')
            .send(testUser);

        const result = await request(app)
            .post('/register')
            .type('json')
            .send(testUser);            

        assert.strictEqual(result.status, 400);
        assert.deepStrictEqual(result.body, {message: 'Email already taken.'});
    });

    it('should login', async () => {
        const testUser = {
            email: faker.internet.email(),
            password: '123456',
            confirmation: '123456'
        };
        await request(app)
            .post('/register')
            .type('json')
            .send(testUser);
            
        const result = await request(app)
            .post('/login')
            .send({email: testUser.email, password: testUser.password});     

        assert.strictEqual(result.status, 200);
        assert.deepStrictEqual(result.body.auth, true);
    });

    it('should not login with wrong credentials', async () => {
        const testUser = {
            email: faker.internet.email(),
            password: '123456',
            confirmation: '123456'
        };
        await request(app)
            .post('/register')
            .type('json')
            .send(testUser);
            
        const result = await request(app)
            .post('/login')
            .send({email: 'aaaaa', password: 'bbbbb'});

        assert.strictEqual(result.status, 401);
    });

    it('should validate password', async () => {
        const testUser = {
            email: faker.internet.email(),
            password: '123456',
            confirmation: '123456'
        };
        await request(app)
            .post('/register')
            .type('json')
            .send(testUser);
            
        const result = await request(app)
            .post('/login')
            .send({email: testUser.email, password: 'wrong-password'});

        assert.strictEqual(result.status, 500);
    });     

    it('should generate token and expiration time when reset password', async () => {
        const email = faker.internet.email();
        const testUser = {
            email,
            password: '123456',
            confirmation: '123456'
        };
        await request(app)
            .post('/register')
            .type('json')
            .send(testUser);
            
        const result = await request(app)
            .post('/reset-password')
            .send({email: testUser.email});

        assert.strictEqual(result.status, 200);
        assert.deepStrictEqual(result.body, {message: 'Check your email.'});

        const user = await User.findOne(result.body.id);

        assert.isDefined(user!.resetPassToken);
        assert.isDefined(user!.resetPassTokenExpires);
    });

    it('should call email service when reset password', async () => {
        const spy = sinon.spy(app.locals['routes'].users.emailService, 'sendEmail');

        const email = faker.internet.email();
        const testUser = {
            email,
            password: '123456',
            confirmation: '123456'
        };
        await request(app)
            .post('/register')
            .type('json')
            .send(testUser);
            
        const result = await request(app)
            .post('/reset-password')
            .send({email: testUser.email});

        assert.strictEqual(result.status, 200);
        sinon.assert.calledOnce(spy);

        const args = spy.args[0];

        assert.strictEqual(args[0].email, testUser.email);
    });    
});