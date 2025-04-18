import net from 'net';
import { config } from '../common/config/config.js';
import { onConnection } from './events/onConnections.js';
import { createSchemas } from '../common/database/database.js';


const server = net.createServer(onConnection);

const startServer = async() => {
    await createSchemas();

    server.listen(config.server.event.port, config.server.event.host, () => {
        console.log(`서버가${config.server.event.host}:${config.server.event.port}/ 에서 실행 중입니다.`);
    });
}

startServer();