import app from '../app';
import request from 'supertest';
import faker from 'faker';
import { testDbConnection } from './dbConntection';
import chai from 'chai';
import { Item } from '../src/models/Item';
import { createTestUser } from './testUser';
import { Group } from '../src/models/Group';
import { Connection } from 'typeorm';

const assert = chai.assert;

describe('ItemController', async () => {
    let user: any;
    let conn: Connection;

    before(async () => {
        conn = await testDbConnection();
        Group.delete({});
        Item.delete({});
        user = await createTestUser(app);
    });

    after(() => {
        conn?.close();
    });

    it('should require authentication', async () => {
        const testItem = {
            name: faker.name.title()
        };        
        const result = await request(app)
            .post('/items')
            .type('json')
            .send(testItem);

        assert.strictEqual(result.status, 401);
    });

    it('should validate fields', async () => {
        const result = await request(app)
            .post('/items')
            .type('json')
            .auth(user.token, {type: 'bearer'})
            .send({});

        assert.strictEqual(result.status, 400);
        assert.deepStrictEqual(result.body, ['Item name must be informed.']);
    });    

    it('should create an Item', async () => {
        const testItem = {
            name: faker.name.title()
        };

        const result = await request(app)
            .post('/items')
            .type('json')
            .auth(user.token, {type: 'bearer'})
            .send(testItem);

        assert.strictEqual(result.status, 201);
        assert.isDefined(result.body.id);
    });

    it('should create an Item with groups', async () => {
        const testGroup = {
            name: faker.name.title()
        };

        const group = await request(app)
            .post('/groups')
            .type('json')
            .auth(user.token, {type: 'bearer'})
            .send(testGroup);

        const testItem = {
            name: faker.name.title(),
            groups: [group.body.id]
        };

        const result = await request(app)
            .post('/items')
            .type('json')
            .auth(user.token, {type: 'bearer'})
            .send(testItem);

        const created = await request(app)
            .get(`/items/${result.body.id}`)
            .auth(user.token, {type: 'bearer'});

        assert.strictEqual(result.status, 201);
        assert.isDefined(result.body.id);
        assert.isArray(created.body.groups);
        assert.strictEqual(created.body.groups[0].id, group.body.id);
    });    

    it('should get Item by id', async () => {
        const testItem = {
            name: faker.name.title()
        };        
        const created = await request(app)
            .post('/items')
            .type('json')
            .auth(user.token, {type: 'bearer'})
            .send(testItem);

        const result = await request(app)
            .get(`/items/${created.body.id}`)
            .auth(user.token, {type: 'bearer'});            

        assert.strictEqual(result.status, 200);
        assert.strictEqual(result.body.id, created.body.id);
    });

    it('should get all Items', async () => {
        const testItem = {
            name: faker.name.title()
        };        
        await request(app)
            .post('/Items')
            .type('json')
            .auth(user.token, {type: 'bearer'})
            .send(testItem);

        const result = await request(app)
            .get('/items')
            .auth(user.token, {type: 'bearer'});

        assert.strictEqual(result.status, 200);
        assert.isArray(result.body);
    });      

    it('should update an Item', async () => {
        const testItem = {
            name: faker.name.title()
        };        
        const created = await request(app)
            .post('/items')
            .auth(user.token, {type: 'bearer'})
            .type('json')
            .send(testItem);

        testItem.name = testItem.name + ' updated';

        const result = await request(app)
            .put(`/items/${created.body.id}`)
            .auth(user.token, {type: 'bearer'})
            .type('json')
            .send(testItem);

        assert.strictEqual(result.status, 200);
        assert.deepStrictEqual(result.body.name, testItem.name);
    });
    
    it('should delete an Item', async () => {
        const testItem = {
            name: faker.name.title()
        };        
        const created = await request(app)
            .post('/items')
            .auth(user.token, {type: 'bearer'})
            .type('json')
            .send(testItem);

        const result = await request(app)
            .delete(`/items/${created.body.id}`)
            .auth(user.token, {type: 'bearer'})
            .type('json')
            .send();

        assert.strictEqual(result.status, 204);

        const getById = await request(app)
            .get(`/items/${created.body.id}`)
            .auth(user.token, {type: 'bearer'});

        assert.strictEqual(getById.status, 404);    
    });    
});