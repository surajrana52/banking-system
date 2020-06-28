module.exports = {
    "type": "mysql",
    "host": process.env.DB_HOST,
    "port": 3306,
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "synchronize": false,
    "logging": true,
    "bigNumberStrings": false,
    "entities": [
        "dist/entity/**/*.js"
    ],
    "migrations": [
        "dist/migration/**/*.js"
    ],
    "subscribers": [
        "dist/subscriber/**/*.js"
    ],
    "cli": {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
    }
};
