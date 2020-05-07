module.exports = {
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'supersecurepass',
    database: 'ptech',
    logging: ['error'],
    synchronize: true,
    entities: ['src/models/**/*.*'],
    migrationsTableName: "db_changelog",
    migrations: [__dirname + "/dist/migrations/*.js"],
    cli: {
        migrationsDir: "migrations"
    }
}