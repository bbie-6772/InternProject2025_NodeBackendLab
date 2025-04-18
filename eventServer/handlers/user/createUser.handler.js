import { config } from "../../../common/config/config.js";
import { userRepository, userSession } from "../../session.js"
import { makePacket } from "../../utils/packet/makePacket.js";

export const createUserHandler = async (socket, payload) => {
    const { name } = payload;

    const id = userRepository.findUser(name);
    if (!id) {
        const response = { error: "User not found"};
        const packet = makePacket(config.header.packetType.S_ERROR_NOTIFICATION, response );
        socket.write(packet);
        return;
    }

    socket.id = id;
    userSession.addUser(socket);
}