import { config } from "../../common/config/config.js";
import { handlers } from "../handlers/index.js";
import { onEnd } from "./onEnd.js";

export const onData = (socket) => async (data) => {

    socket.buffer = Buffer.concat([socket.buffer, data]);
    const packetTypeByte = config.header.packetTypeByte;
    const payloadLengthByte = config.header.payloadLengthByte;
    let payloadByte = 0;
    const defaultLength = packetTypeByte + payloadLengthByte

    try {
        while (socket.buffer.length >= defaultLength) {
            try {
                payloadByte = socket.buffer.readUInt32BE(packetTypeByte);
            } catch (err) {
                onEnd(socket)();
                break;
            }

            if (socket.buffer.length < defaultLength + payloadByte) break;
            const packet = socket.buffer.subarray(0, defaultLength + payloadByte);
            socket.buffer = socket.buffer.subarray(defaultLength + payloadByte);

            const packetType = packet.readUInt16BE(0);
            const payloadBuffer = packet.subarray(defaultLength, defaultLength + payloadByte);

            const handler = handlers[packetType];
            await handler( socket, payloadBuffer );
        }
    } catch (err) {
        console.error(err);
    }
}