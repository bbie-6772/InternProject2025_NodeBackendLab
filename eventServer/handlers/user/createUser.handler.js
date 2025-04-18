import { config } from "../../../common/config/config.js";
import { onEnd } from "../../events/onEnd.js";
import { userRepository, userSession } from "../../session.js"
import { makePacket } from "../../utils/packet/makePacket.js";

export const createUserHandler = async (socket, payload) => {
    const { name } = payload;

    const results = await userRepository.enqueue(userRepository.findUser, name);
    if (!results) {
        const response = { error: "User not found"};
        const packet = makePacket(config.header.packetType.S_ERROR_NOTIFICATION, response );
        socket.write(packet);
        onEnd(socket)();
        return;
    }

    socket.id = results.id;
    userSession.addUser(socket);
}