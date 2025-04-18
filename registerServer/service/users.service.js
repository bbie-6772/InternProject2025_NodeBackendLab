import cluster from "cluster";
import { clusterQueue } from "../../eventServer/session.js";

export class UsersService {
    constructor(userRepository, parseJson, jobQueue) {
        this.userRepository = userRepository;
        this.parseJson = parseJson;
        this.jobQueue = jobQueue;
    }
 
    createUser = async (req, res) => {
        await this.parseJson(req, res);
        const { name, address } = req.body

        let isSuccess = false;
        if (cluster.isWorker) {
            isSuccess = await clusterQueue.sendRequestToMaster({
                method: "createUser",
                args: [name, address]
            });
        } else 
            isSuccess = await this.jobQueue.enqueue(() => 
                this.userRepository.createUser(name, address)
            );
        
        if (!isSuccess)
            throw new Error("계정 생성 실패");

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ results: 'Success' }));
    }
}