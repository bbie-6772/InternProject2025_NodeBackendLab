import { config } from "../../../common/config/config.js";
import { makePacket } from "../../utils/packet/makePacket.js";

export const getWinnerHandler = async (socket, payload, deps) => {
    const { userSession } = deps;

    let packet
    const results = await userSession.getWinner();
    if (!results) {
        packet = makePacket(config.header.packetType.S_ERROR_NOTIFICATION, { error: "Winner not found" } );
        await socket.write(packet);
        throw new Error("Winner not found")
    }
    packet = makePacket(config.header.packetType.S_GET_WINNER_RESPONSE, results);
    await socket.write(packet);
}