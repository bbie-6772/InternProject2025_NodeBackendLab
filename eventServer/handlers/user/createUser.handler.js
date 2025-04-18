import { config } from "../../../common/config/config.js";
import { makePacket } from "../../utils/packet/makePacket.js";

export const createUserHandler = async (socket, payload, deps) => {
    const { userRepository, userSession } = deps;
    const { name } = payload;

    const results = await userSession.jobQueue.enqueue(() => userRepository.findUser(name) );
    if (!results) {
        const response = { error: "User not found"};
        const packet = makePacket(config.header.packetType.S_ERROR_NOTIFICATION, response );
        socket.write(packet);
        throw new Error("User not found")
    }

    socket.id = results.id;
    userSession.addUser(socket);
}