import assert from 'assert';
import { makePacket } from '../../../eventServer/utils/packet/makePacket.js';
import { onData } from '../../../eventServer/events/onData.js';

async function testOnDataSuccess () {
    let result;
    // 1) socket 모킹
    const socket = {
        buffer : Buffer.alloc(0),
    }
    // 2) data 모킹
    const data = makePacket(1, { test: "success" });
    // 3) onEnd 모킹
    const onEnd = () => () => {
        result = false;
    }
    // 4) handlers 모킹 
    const handlers = {
        1: async ( socket, payload ) => { 
            result = payload;
            return;
         }
    }
    // 5) onData 실행
    await onData(socket, handlers, onEnd)(data);

    // 6) 성공 시 응답 대조
    assert.deepStrictEqual(result, { test: "success" }, "성공 시 result 값이 보낸값과 동일해야함");
    
    console.log("testOnDataSuccess: 통과");
}

async function testOnDataFailToDecode() {
    // 1) socket 모킹
    const socket = {
        buffer: Buffer.alloc(0),
    }
    // 2) data 모킹
    const data = Buffer.alloc(100);
    // 3) onEnd 모킹
    const onEnd = () => () => {
        result = false;
    }
    let result;
    // 4) handlers 모킹 
    const handlers = {
        1: async (socket, payload) => {
            result = payload;
            return;
        }
    }
    // 5) onData 실행
    await onData(socket, handlers, onEnd)(data);

    // 6) 실패 시 응답 대조
    assert.strictEqual(result, false, " 실패 시 result 값이 false 이어야함")

    console.log("testOnDataFailToDecode: 통과")
}

async function testOnDataFailToDataLength() {
    let result;
    // 1) socket 모킹
    const socket = {
        buffer: Buffer.alloc(0),
    }
    // 2) data 모킹
    const data = makePacket(1, { test: "success" }).subarray(0, 7);
    // 3) onEnd 모킹
    const onEnd = () => () => {
        result = false;
    }
    // 4) handlers 모킹 
    const handlers = {
        1: async (socket, payload) => {
            result = payload;
            return;
        }
    }
    // 5) onData 실행
    await onData(socket, handlers, onEnd)(data);

    // 6) 실패 시 응답 대조
    assert.deepStrictEqual(result, undefined, " 실패 시 result 값이 undefined 이어야함")

    console.log("testOnDataFailToDataLength: 통과")
}

async function testOnDataFailToPacketType() {
    let result;
    // 1) socket 모킹
    const socket = {
        buffer: Buffer.alloc(0),
    }
    // 2) data 모킹
    const data = makePacket(5, { test: "success" });
    // 3) onEnd 모킹
    const onEnd = () => () => {
        result = false;
    }
    // 4) handlers 모킹 
    const handlers = {
        1: async (socket, payload) => {
            result = payload;
            return;
        }
    }
    // 5) onData 실행
    await onData(socket, handlers, onEnd)(data);

    // 6) 실패 시 응답 대조
    assert.deepStrictEqual(result, false, " 실패 시 result 값이 undefined 이어야함")

    console.log("testOnDataFailToPacketType: 통과")
}

await testOnDataSuccess();
await testOnDataFailToDecode();
await testOnDataFailToDataLength();
await testOnDataFailToPacketType();
console.log("onData 테스트 완료")