import app from './app';

const server = app.listen(app.get('port'), () => {
    console.table([
        {
            database: "",
            host: `http://localhost:${app.get('port')}`,
            env: app.get('env')
        },
    ]);
});
