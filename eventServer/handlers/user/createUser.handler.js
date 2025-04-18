import { config } from "../../../common/config/config.js";
import { clusterQueue } from "../../session.js";
import { makePacket } from "../../utils/packet/makePacket.js";
import cluster from 'cluster';

export const createUserHandler = async (socket, payload, deps) => {
    const { userRepository, userSession } = deps;
    const { name } = payload;

    let results 
    if (cluster.isWorker) 
        results = await clusterQueue.sendRequestToMaster({
                method: "findUser",
                args: [name]
            });
    else
        results = await userSession.jobQueue.enqueue(async () => await userRepository.findUser(name) );
    
    if (!results) {
        const response = { error: "User not found"};
        const packet = makePacket(config.header.packetType.S_ERROR_NOTIFICATION, response );
        await socket.write(packet);
        throw new Error("User not found")
    }

    socket.id = results.id;
    userSession.addUser(socket.id);
    
    const packet = makePacket(config.header.packetType.S_LOGIN_RESPONSE, { results: "success"});
    await socket.write(packet);
}