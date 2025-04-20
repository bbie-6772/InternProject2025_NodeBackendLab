import assert from 'assert';
import { makePacket } from '../../../eventServer/utils/packet/makePacket.js';
import { parsePacket } from '../../../eventServer/utils/packet/parsePacket.js';

async function testParsePacketSuccess () {
    // 1) packetType 모킹
    const mockPacketType = 1002;
    // 2) payload 모킹
    const mockPayload = { test: "success"};
    // 3) Packet 모킹
    const mockPacket = makePacket(mockPacketType, mockPayload);
    // 4) parsePacket 실행
    const [packetType, payload] = parsePacket(mockPacket);
    // 5) 반환 값 비교
    assert.strictEqual(packetType, mockPacketType, "성공 시 패킷 타입이 동일해야함");
    assert.deepStrictEqual(payload, mockPayload, "성공 시 페이로드가 동일해야함");

    console.log("testParsePacketSuccess: 통과");
}

async function testParsePacketInvalidPacket() {
    // 1) packetType 모킹
    const mockPacketType = 1002;
    // 2) payload 모킹
    const mockPayload = { test: "success" };
    // 3) Packet 모킹
    const mockPacket = makePacket(mockPacketType, mockPayload).subarray(7);
    // 4) parsePacket 실행
    const [packetType, payload] = parsePacket(mockPacket);
    // 5) 반환 값 비교
    assert.strictEqual(packetType, undefined, "실패 시 패킷 타입이 undefined 이어야함");
    assert.deepStrictEqual(payload, undefined, "성공 시 페이로드가 undefined 이어야함");

    console.log("testParsePacketInvalidPacket: 통과");
}

await Promise.all([
    testParsePacketSuccess(),
    testParsePacketInvalidPacket(),
])

console.log("parsePacket 테스트 완료")