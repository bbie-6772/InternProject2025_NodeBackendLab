import assert from 'assert';
import { onError } from '../../../eventServer/events/onError.js';

async function testOnErrorSuccess() {
    let endCalled = false;
    let destroyCalled = false;
    let userDeleteCalled = false;
    // 1) socket 모킹
    const mockSocket = {
        end: () => {
            endCalled = true;
        },
        destroy: () => {
            destroyCalled = true;
        },
        id: 1
    }
    // 2) userSession 모킹
    const mockUserSession = {
        deleteUserById: () => { userDeleteCalled = true; }
    }
    // 3) error 모킹
    const MockErr = "testOnErrorSuccess 오류 메시지"
    // 4) onError 실행
    await onError(mockSocket, mockUserSession)(MockErr);
    // 5) 성공 시 응답 대조
    assert.strictEqual(userDeleteCalled, true, "성공 시 deleteUserById 가 실행되었어야함")
    assert.strictEqual(endCalled, true, "성공 시 end 가 실행되었어야함")
    assert.strictEqual(destroyCalled, true, "성공 시 destroy 가 실행되었어야함")

    console.log("testOnErrorSuccess: 통과")
}

async function testOnErrorFailToNoId() {
    let endCalled = false;
    let destroyCalled = false;
    let userDeleteCalled = false;
    // 1) socket 모킹
    const mockSocket = {
        end: () => { endCalled = true; },
        destroy: () => { destroyCalled = true; },
        id: undefined
    };
    // 2) userSession 모킹
    const mockUserSession = {
        deleteUserById: () => { userDeleteCalled = true; }
    };
    // 3) error 모킹
    const MockErr = "testOnErrorFailToNoId 오류 메시지"
    // 4) onError 실행
    await onError(mockSocket, mockUserSession)(MockErr);
    // 5) 실패 시 응답 대조
    assert.strictEqual(userDeleteCalled, false, "id 없으면 deleteUserById 호출 없어야 함");
    assert.strictEqual(endCalled, true, "end 호출되어야 함");
    assert.strictEqual(destroyCalled, true, "destroy 호출되어야 함");

    console.log("testOnErrorFailToNoId: 통과");
}

await testOnErrorSuccess();
await testOnErrorFailToNoId();
console.log("onError 테스트 완료 ")