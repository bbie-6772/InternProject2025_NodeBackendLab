import assert from 'assert';
import { parsePacket } from '../../../eventServer/utils/packet/parsePacket.js';
import { makePacket } from '../../../eventServer/utils/packet/makePacket.js';

async function testMakePacketSuccess () {
    // 1) packetType 모킹
    const mockPacketType = 1002;
    // 2) payload 모킹
    const mockPayload = { test: "success"};
    // 3) makePacket 실행
    const packet = makePacket(mockPacketType, mockPayload);
    // 4) parsePacket 실행
    const [ packetType , payload ] = parsePacket(packet);
    // 5) 성공 시 값 대조
    assert.strictEqual(mockPacketType, packetType, "성공 시 패킷 타입이 동일해야함");
    assert.deepStrictEqual(mockPayload, payload, "성공 시 페이로드가 동일해야함");

    console.log("testMakePacketSuccess: 통과");
}

async function testMakePacketInvalidPayload() {
    // 1) 순환참조 payload 모킹
    const circular = {};
    circular.self = circular;
    // 2) makePacket 실행
    try {
        makePacket(1, circular);
        assert.fail("순환 참조 payload는 에러가 발생해야 함");
    } catch (err) {
        assert.ok(err instanceof TypeError, "JSON.stringify 오류로 TypeError 발생");
        console.log("testMakePacketInvalidPayload: 통과");
    }
}

await Promise.all([
    testMakePacketSuccess,
    testMakePacketInvalidPayload,
])

console.log("makePacket 테스트 완료")