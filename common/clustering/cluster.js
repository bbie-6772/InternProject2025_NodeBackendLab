import cluster from 'cluster';
import os from 'os';
import { startEventServer } from '../../eventServer/server.js';
import { startRegisterServer } from '../../registerServer/server.js';
import { config } from '../config/config.js';
import { createSchemas, db } from '../database/database.js';
import { JobQueue } from '../utils/jobQueue.js';
import { UsersRepository } from '../database/repository/users.repository.js';

const numCPUs = os.cpus().length;  

const startCluster = async () => {
    if (cluster.isPrimary) {
        console.log(`대빵 Process ${process.pid} 작업중`);  
        await createSchemas();
        const jobQueue = new JobQueue();
        const userRepository = new UsersRepository(db);

        for(let i = 0;i < numCPUs;i++) {
            const worker = cluster.fork();

            worker.on('message', async (msg) => {
                const { id, method, args } = msg;
                try {
                    if (typeof userRepository[method] !== 'function')
                        throw new Error(`Unknown method: ${method}`);

                    const result = await jobQueue.enqueue(() => userRepository[method](...args));
                    worker.send({ id, result });
                } catch (err) {
                    worker.send({ id, error: err.message });
                }
            }); 
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