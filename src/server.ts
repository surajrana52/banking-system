import 'reflect-metadata';
import {redis} from './config/redis';
import { createConnection } from 'typeorm';
import app from './app';

redis.on('ready', () => {
    console.log("Redis is ready for accepting commands.")
});

(async () => {

    let dbConnection = await createConnection();

    const server = app.listen(app.get('port'), () => {

        console.table([
            {
                database: dbConnection.options.database,
                host: `http://localhost:${app.get('port')}`,
                env: app.get('env')
            },
        ]);

    });

})();
