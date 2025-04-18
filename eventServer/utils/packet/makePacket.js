export const makePacket = (packetType, payload) => {
    const payloadString = JSON.stringify(payload);
    const payloadBuffer = Buffer.from(payloadString, 'utf8');

    const packetTypeBuffer = Buffer.alloc(2);
    packetTypeBuffer.writeUInt16BE(packetType);

    const payloadLengthBuffer = Buffer.alloc(4);
    payloadLengthBuffer.writeUInt32BE(payloadBuffer.length);

    const packet = Buffer.concat([
        packetTypeBuffer,
        payloadLengthBuffer,
        payloadBuffer
    ])

    return packet
}