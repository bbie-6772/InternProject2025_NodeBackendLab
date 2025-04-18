import { config } from "../../../common/config/config.js";

export const makePacket = (packetType, payload) => {
    const payloadString = JSON.stringify(payload);
    const payloadBuffer = Buffer.from(payloadString, 'utf8');

    const packetTypeBuffer = Buffer.alloc(config.header.packetTypeByte);
    packetTypeBuffer.writeUInt16BE(packetType);

    const payloadLengthBuffer = Buffer.alloc(config.header.payloadLengthByte);
    payloadLengthBuffer.writeUInt32BE(payloadBuffer.length);

    const packet = Buffer.concat([
        packetTypeBuffer,
        payloadLengthBuffer,
        payloadBuffer
    ])

    return packet
}