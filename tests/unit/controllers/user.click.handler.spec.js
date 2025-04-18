import assert from 'assert';

import { parsePacket } from "../../../eventServer/utils/packet/parsePacket.js"
import { clickHandler } from '../../../eventServer/handlers/user/click.handler.js';

async function testClickHandlerSuccess() {
    let errorMessage = null;
    let errorCalled = false;
    let addCountCalled = false;
    // 1) socket 모킹
    const mockSocket = {
        write: async (packet) => {
            errorMessage = parsePacket(packet);
        },
        id: 1
    }
    // 2) deps 모킹
    const mockDeps = {
        userSession: {
            getUserById: (id) => {
                return {
                    addCount : () => {
                        addCountCalled = true;
                    }
                }
            }
        }
    };
    // 3) clickHandler 실행
    try {
        await clickHandler(mockSocket, null, mockDeps);
    } catch (err) {
        errorCalled = true;
    }
    // 4) 성공 시 값 대조
    assert.strictEqual(errorMessage, null, "성공 시 오류 메시지는 null 이여야함");
    assert.strictEqual(errorCalled, false, "성공 시 오류는 호출되지 않았어야함");
    assert.strictEqual(addCountCalled, true, "성공 시 addCount는 호출되었어야함");

    console.log("testClickHandlerSuccess: 통과");
}

async function testClickHandlerFailToSearch() {
    let errorMessage = null;
    let errorCalled = false;
    let addCountCalled = false;
    // 1) socket 모킹
    const mockSocket = {
        write: async (packet) => {
            errorMessage = parsePacket(packet);
        },
        id: 1
    }
    // 2) deps 모킹
    const mockDeps = {
        userSession: {
            getUserById: (id) => {
                return undefined;
            }
        }
    };
    // 3) clickHandler 실행
    try {
        await clickHandler(mockSocket, null, mockDeps);
    } catch (err) {
        errorCalled = true;
    }
    // 4) 실패 시 값 대조
    assert.deepStrictEqual(errorMessage, { error: "User not found" }, "실패 시 오류 메시지는 { error: User not found} 이여야함");
    assert.strictEqual(errorCalled, true, "실패 시 오류는 호출되어야함");
    assert.strictEqual(addCountCalled, false, "성공 시 addCount는 호출되지 않았어야함");

    console.log("testClickHandlerFailToSearch: 통과");
}

await Promise.all([
    testClickHandlerSuccess(),
    testClickHandlerFailToSearch(),
])

console.log("clickHandler 테스트 완료");