import http from 'http';
import { routes } from './routes/routes.js';
import { config } from '../common/config/config.js';
import cluster from 'cluster';
import { createSchemas } from '../common/database/database.js';

const server = http.createServer((req, res) => {
    const methodRoutes = routes[req.method];
    if (!methodRoutes) {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }  

    // 쿼리 스트링 제외
    const path = req.url.split('?')[0];
    const handler = methodRoutes[path];
    if (!handler) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
        return;   
    }

    handler(req, res);
});

export const startRegisterServer = async(port) => {
    if (!cluster.isWorker && !cluster.isPrimary)
        await createSchemas();

    server.listen(port, () => {
        console.log(`서버가 ${port} 에서 실행 중입니다.`);
    });
}

if (!cluster.isWorker && !cluster.isPrimary)
    startRegisterServer(config.server.register.port);