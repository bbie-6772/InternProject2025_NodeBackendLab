import { config } from "../../../common/config/config.js";
import { makePacket } from "../../utils/packet/makePacket.js";

export const clickHandler = async (socket, payload, deps ) => {
    const { userSession } = deps

    const user = userSession.getUserById(socket.id);
    if(!user) {
        const response = { error: "User not found" };
        const packet = makePacket(config.header.packetType.S_ERROR_NOTIFICATION, response);
        socket.write(packet);
        return;
    }

    user.addCount();
}   