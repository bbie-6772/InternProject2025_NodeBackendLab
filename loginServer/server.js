import http from 'http';
import { config } from '../common/config/config.js';
import { accountRouter } from './routes/account.router.js';
import { createSchemas } from './database/database.js';

const routes = { ...accountRouter,};  

const server = http.createServer((req, res) => {
    const handler = routes[req.url];
    if (handler) handler(req, res);
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 ERROR - Can not find page');
    }
});

const startServer = async() => {
    await createSchemas();

    server.listen(config.LOGIN_SERVER.port, config.LOGIN_SERVER.host, () => {
        console.log(`서버가 http://${config.LOGIN_SERVER.host}:${config.LOGIN_SERVER.port}/ 에서 실행 중입니다.`);
    });
}

startServer();