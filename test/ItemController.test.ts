import app from '../app';
import request from 'supertest';
import faker from 'faker';
import { testDbConnection } from './dbConntection';
import chai from 'chai';
import sinon from 'sinon';
import { Item } from '../src/models/Item';

const assert = chai.assert;

describe('ItemController', async () => {
    before(async () => {
        await testDbConnection();
        Item.delete({});
    });
});

// WIP