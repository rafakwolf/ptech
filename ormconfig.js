module.exports = {
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'fred',
    database: 'ptech',
    logging: ['error'],
    synchronize: true,
    entities: [__dirname + "/dist/src/models/*.js"],
    migrationsTableName: "db_changelog",
    migrations: [__dirname + "/dist/migrations/*.js"],
    cli: {
        migrationsDir: "migrations"
    }
}