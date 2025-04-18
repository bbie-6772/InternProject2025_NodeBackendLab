import http from 'http';
import { config } from '../common/config/config.js';
import { usersRouter } from './routes/users.router.js';
import { createSchemas } from './database/database.js';

const routes = { ...usersRouter,};  

const server = http.createServer((req, res) => {
    const handler = routes[req.url];
    if (handler) handler(req, res);
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end('404 ERROR - Can not find page');
    }
});

const startServer = async() => {
    await createSchemas();

    server.listen(config.REGISTER_SERVER.port, config.REGISTER_SERVER.host, () => {
        console.log(`서버가 http://${config.REGISTER_SERVER.host}:${config.REGISTER_SERVER.port}/ 에서 실행 중입니다.`);
    });
}

startServer();