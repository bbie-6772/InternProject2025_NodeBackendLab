import assert from 'assert';
import { parsePacket } from "../../../eventServer/utils/packet/parsePacket.js"
import { getWinnerHandler } from '../../../eventServer/handlers/user/getWinner.handler.js';

async function testGetWinnerSuccess () {
    let message = null;
    let errorCalled = false;
    // 1) socket 모킹
    const mockSocket = {
        write : async (packet) => {
            message = parsePacket(packet)[1];
        }
    }
    // 2) payload 모킹
    const mockPayload = {};
    // 3) deps 모킹
    const mockDeps = {
        userSession : {
            getWinner: async (socket) => {
                return { test : "success"}
            }
        }
    };
    // 4) getWinnerHandler 실행
    try {
        await getWinnerHandler(mockSocket, mockPayload, mockDeps);
    } catch (err) {
        errorCalled = true;
    }
    // 5) 성공 시 값 대조
    assert.deepStrictEqual(message, { test: "success" }, "성공 시 메시지는 { test : success} 이여야함");
    assert.strictEqual(errorCalled, false, "성공 시 오류는 호출되지 않았어야함");

    console.log("testGetWinnerSuccess: 통과");
}

async function testGetWinnerFailToSearch() {
    let message = null;
    let errorCalled = false;
    // 1) socket 모킹
    const mockSocket = {
        write: async (packet) => {
            message = parsePacket(packet)[1];
        }
    }
    // 2) payload 모킹
    const mockPayload = {};
    // 3) deps 모킹
    const mockDeps = {
        userSession: {
            getWinner: async (socket) => {
                return undefined
            }
        }
    };
    // 4) getWinnerHandler 실행
    try {
        await getWinnerHandler(mockSocket, mockPayload, mockDeps);
    } catch (err) {
        errorCalled = true;
    }
    // 5) 성공 시 값 대조
    assert.deepStrictEqual(message, { error: "Winner not found" }, "실패 시 메시지는 { error: User not found} 이여야함");
    assert.strictEqual(errorCalled, true, "실패 시 오류는 호출되어야함");

    console.log("testGetWinnerFailToSearch: 통과");
}


await Promise.all([
    testGetWinnerSuccess(),
    testGetWinnerFailToSearch(),
])

console.log("getWinnerHandler 테스트 완료");