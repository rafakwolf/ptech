import app from '../app';
import request from 'supertest';
import faker from 'faker';
import { testDbConnection } from './dbConntection';
import chai from 'chai';
import sinon from 'sinon';
import { Group } from '../src/models/Group';

const assert = chai.assert;

describe('GroupController', async () => {
    before(async () => {
        await testDbConnection();
        Group.delete({});
    });
});

// WIP