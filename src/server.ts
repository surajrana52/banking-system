import 'reflect-metadata';
import { createConnection } from 'typeorm';
import app from './app';

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
