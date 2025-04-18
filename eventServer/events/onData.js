import { config } from "../../common/config/config.js";

export const onData = (socket, handlers, onEnd ) => async (data) => {
    socket.buffer = Buffer.concat([socket.buffer, data]);
    const packetTypeByte = config.header.packetTypeByte;
    const payloadLengthByte = config.header.payloadLengthByte;
    let payloadByte = 0;
    const defaultLength = packetTypeByte + payloadLengthByte

    try {
        while (socket.buffer.length >= defaultLength) {
            payloadByte = socket.buffer.readUInt32BE(packetTypeByte);
            if (socket.buffer.length < defaultLength + payloadByte) break;

            const packet = socket.buffer.subarray(0, defaultLength + payloadByte);
            socket.buffer = socket.buffer.subarray(defaultLength + payloadByte);

            const packetType = packet.readUInt16BE(0);
            const payloadBuffer = packet.subarray(defaultLength, defaultLength + payloadByte);
            const payloadString = payloadBuffer.toString('utf8');
            let payload;
            try {
                payload = JSON.parse(payloadString);
            } catch (err) {
                console.error("JSON 파싱 실패:", err);
                onEnd(socket)();
                break;
            }  

            const handler = handlers[packetType];
            if (typeof handler !== 'function') {
                console.error("올바르지 않은 패킷 타입");
                onEnd(socket)();
                break;
            }
                
            await handler( socket, payload );
        }
    } catch (err) {
        console.error(err);
    }
}