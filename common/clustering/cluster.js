import cluster from 'cluster';
import os from 'os';
import { startEventServer } from '../../eventServer/server.js';
import { startRegisterServer } from '../../registerServer/server.js';
import { config } from '../config/config.js';

const numCPUs = os.cpus().length;  

const startCluster = () => {
    if (cluster.isPrimary) {
        console.log(`대빵 Process ${process.pid} 작업중`);  
        for(let i = 0;i < numCPUs;i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal ) => {
            console.log(`Worker ${worker.process.pid} 의 사망선고. 부활중...`);  
            cluster.fork();
        });
    } else {
        startRegisterServer(config.server.register.port);
        startEventServer(config.server.event.port + cluster.worker.id);
    }
}

startCluster();