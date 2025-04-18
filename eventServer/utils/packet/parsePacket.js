import { config } from "../../../common/config/config.js";

export const parsePacket = (packet) => {
    const packetTypeByte = config.header.packetTypeByte;
    const payloadLengthByte = config.header.payloadLengthByte;
    const defaultLength = packetTypeByte + payloadLengthByte
    let payloadByte = 0;

    try {
        payloadByte = packet.readUInt32BE(packetTypeByte);
    } catch (err) {
        console.error("payload 읽기 실패", err);
        return [];
    }
    
    if (packet.length < defaultLength + payloadByte) {
        console.error("패킷 길이 부족")
        return [];
    }

    const packetType = packet.readUInt16BE(0);
    const payloadBuffer = packet.subarray(defaultLength, defaultLength + payloadByte);
    const payloadString = payloadBuffer.toString('utf8');
    let payload;
    try {
        payload = JSON.parse(payloadString);
    } catch (err) {
        console.error("JSON 파싱 실패:", err);
        return [];
    }

    return [packetType , payload];
}



