import app from '../app';
import request from 'supertest';
import faker from 'faker';
import { testDbConnection } from './dbConntection';
import chai from 'chai';
import { Group } from '../src/models/Group';
import { createTestUser } from './testUser';
import { Connection } from 'typeorm';

const assert = chai.assert;

describe('GroupController', async () => {
    let user: any;
    let conn: Connection;

    before(async () => {
        conn = await testDbConnection();
        Group.delete({});
        user = await createTestUser(app);
    });

    after(() => {
        conn?.close();
    });

    it('should require authentication', async () => {
        const testGroup = {
            name: faker.name.title()
        };        
        const result = await request(app)
            .post('/groups')
            .type('json')
            .send(testGroup);

        assert.strictEqual(result.status, 401);
    });

    it('should validate fields', async () => {
        const result = await request(app)
            .post('/groups')
            .type('json')
            .auth(user.token, {type: 'bearer'})
            .send({});

        assert.strictEqual(result.status, 400);
        assert.deepStrictEqual(result.body, ['Group name must be informed.']);
    });    

    it('should create a group', async () => {
        const testGroup = {
            name: faker.name.title()
        };

        const result = await request(app)
            .post('/groups')
            .type('json')
            .auth(user.token, {type: 'bearer'})
            .send(testGroup);

        assert.strictEqual(result.status, 201);
        assert.isDefined(result.body.id);
    });

    it('should get group by id', async () => {
        const testGroup = {
            name: faker.name.title()
        };        
        const created = await request(app)
            .post('/groups')
            .type('json')
            .auth(user.token, {type: 'bearer'})
            .send(testGroup);

        const result = await request(app)
            .get(`/groups/${created.body.id}`)
            .auth(user.token, {type: 'bearer'});            

        assert.strictEqual(result.status, 200);
        assert.strictEqual(result.body.id, created.body.id);
    });

    it('should get all groups', async () => {
        const testGroup = {
            name: faker.name.title()
        };        
        await request(app)
            .post('/groups')
            .type('json')
            .auth(user.token, {type: 'bearer'})
            .send(testGroup);

        const result = await request(app)
            .get('/groups')
            .auth(user.token, {type: 'bearer'});

        assert.strictEqual(result.status, 200);
        assert.isArray(result.body);
    });      

    it('should update a group', async () => {
        const testGroup = {
            name: faker.name.title()
        };        
        const created = await request(app)
            .post('/groups')
            .auth(user.token, {type: 'bearer'})
            .type('json')
            .send(testGroup);

        testGroup.name = testGroup.name + ' updated';

        const result = await request(app)
            .put(`/groups/${created.body.id}`)
            .auth(user.token, {type: 'bearer'})
            .type('json')
            .send(testGroup);

        assert.strictEqual(result.status, 200);
        assert.deepStrictEqual(result.body.name, testGroup.name);
    });
    
    it('should delete a group', async () => {
        const testGroup = {
            name: faker.name.title()
        };        
        const created = await request(app)
            .post('/groups')
            .auth(user.token, {type: 'bearer'})
            .type('json')
            .send(testGroup);

        const result = await request(app)
            .delete(`/groups/${created.body.id}`)
            .auth(user.token, {type: 'bearer'})
            .type('json')
            .send();

        assert.strictEqual(result.status, 204);

        const getById = await request(app)
            .get(`/groups/${created.body.id}`)
            .auth(user.token, {type: 'bearer'});

        assert.strictEqual(getById.status, 404);    
    });    
});