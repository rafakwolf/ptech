import { createConnection } from 'typeorm';
import * as path from 'path';

export async function testDbConnection(drop: boolean = false) {
    return createConnection({
        name: 'default',
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'supersecurepass',
        database: 'ptech',
        logging: ['error'],
        entities: [path.join(__dirname, '../src/models/*.*')],
    });
}