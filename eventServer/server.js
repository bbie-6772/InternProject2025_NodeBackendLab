import net from 'net';
import { config } from '../common/config/config.js';
import { onConnection } from './events/onConnections.js';
import cluster from 'cluster';
import { createSchemas } from '../common/database/database.js';


const server = net.createServer(onConnection);

export const startEventServer = async(port) => {
    if (!cluster.isWorker && !cluster.isPrimary)
        await createSchemas();

    server.listen(port, () => {
        console.log(`서버가 ${port} 에서 실행 중입니다.`);
    });
}
if (!cluster.isWorker && !cluster.isPrimary)
    startEventServer(config.server.event.port);